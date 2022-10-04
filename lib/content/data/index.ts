import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { getAssetById } from "../../../lib/asset/data";
import { getContentTemplateById } from "../../contentTemplate/data";
import { errorIfUndefined } from "../../utils";
import { Content, ContentId, ContentStatus, ContentTemplate, FieldGroup } from "./content.model";
import { ContentField } from "./types";
/*import {
    ContentTemplateHistory,
    ContentTemplate as ContentTemplateModel,
} from "../../../lib/contentTemplate/data/contentTemplate.model";*/

import pluralize from "pluralize";
import { Required } from "utility-types";
import { deleteAllContentRelations } from "../../../lib/relation/data";
import { objArrayToHashmap, objArrToKeyIndexedMap } from "../../../utils/arrayModify";
import { getObjectChanges } from "../../../utils/objects";
import { updateRelationValue } from "./functions/relation";
import { fieldBaseValues, fieldFromTemplateProperty } from "./functions/field";
import { duplicateGroup, generateFieldGroups } from "./functions/group";
import { HistoryEntry } from "@lib/historyEntry/data/historyEntry.model";

//* Create content */
export async function createContent({
    contentTemplateId,
    projectId,
    userId,
    fields,
}: {
    contentTemplateId: string;
    projectId: string;
    userId: string;
    fields?: ContentField[];
}) {
    errorIfUndefined({ contentTemplateId, projectId, userId });
    const contentTemplate = await getContentTemplateById(contentTemplateId);
    if (!contentTemplate) {
        throw new Error("Content template not found");
    }
    const date = new Date().toISOString();

    const contentFieldPromises = contentTemplate.properties.map((property) => {
        const field = fieldFromTemplateProperty({ property, userId });
        return field;
    });

    const contentFields = await Promise.all(contentFieldPromises);

    // create contentTemplate //
    const newContent = new Content({ userId });
    newContent.contentTemplateId = contentTemplateId;
    newContent.projectId = projectId;
    newContent.status = "draft";
    newContent.fields = contentFields.map(({ id }) => id);
    newContent.fieldGroups = generateFieldGroups({
        fields: contentFields,
        propertyGroups: contentTemplate.propertyGroups,
    });
    /*newContent.fields = 
        /*contentUpdates.push({
            type: "property",
            action: "created",
            fieldId: field.id,
            note: "Created from template",
            fieldName: field.name,
            changes: getObjectChanges({ property }, field),
            fieldType: "template",
        });
        if (field.value) {
            contentUpdates.push({
                type: "value",
                fieldId: field.id,
                change: { to: field?.value },
                note: "Set from default value",
                fieldName: field.name,
            });
        }

        
    });*/

    await newContent.saveWithHistory({
        editedBy: userId,
        title: `${contentTemplate.name} Created`,
    });

    return { newContent, contentTemplate };
}

async function fetchLinkedContentPromises(field: ContentField) {
    if (field.type === "image" && field?.value?.length) {
        const assets = await Promise.all(field.value.map((assetId) => getAssetById(assetId)));
        return { ...field, assets };
    }
    return field;
}

//* Get content by id */
export async function getContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const [content] = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) {
        throw new Error(`Content not found from ${contentId}`);
    }
    /*const fieldsWithContent = await Promise.all(
        content.fields.map(async (field) => await fetchLinkedContentPromises(field))
    );
    content.fields = fieldsWithContent;*/
    const contentTemplate = await getContentTemplateById(content.contentTemplateId);
    return { content, contentTemplate };
}

//* Update contentStatus */
export async function updateContentStatus({
    contentId,
    status,
    userId,
}: {
    contentId: string;
    status?: ContentStatus;
    userId: string;
}) {
    errorIfUndefined({ contentId, userId });
    const [content] = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) throw new Error("No content found");

    if (status) {
        content.status = status;
        if (status === "archived" || status === "published") {
            content.saveWithHistory({ editedBy: userId, title: "Status Updated" });
        }
    }

    return content;
}

//* Delete content by id */
export async function deleteContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const [content] = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) {
        throw new Error("Cannot delete - Content not found");
    }

    // remove any relations to content
    await deleteAllContentRelations(contentId);

    await content.delete();

    return content;
}

//* Get all content for contentTemplate for project */
export async function getContentOfTemplate({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string;
    projectId?: string;
}) {
    errorIfUndefined({ contentTemplateId });
    const contentTemplate = await getContentTemplateById(contentTemplateId);
    if (!contentTemplate) {
        throw new Error("Content template not found");
    }
    const contentOfType = await indexBy(ContentTemplate({ templateId: contentTemplate.id }))
        .exact(projectId ?? "*")
        .get(Content);
    return { content: contentOfType, contentTemplate };
}

//* Update content field values */
export async function updateContentValues(props: {
    contentId: string;
    values: {
        [fieldId: string]: {
            value?: ContentField["value"];
            note?: ContentField["note"];
            assets?: ContentField["assets"];
        };
    };
    userId: string;
}) {
    const { contentId, values, userId } = props;
    errorIfUndefined({ contentId, userId, values });

    const contentUpdates: HistoryEntry[] = [];

    const { content } = await getContentById(contentId);

    if (!content) throw new Error("No content found");

    const updatedFields = (await Promise.all(
        content.fields.map(async (field) => {
            const { id } = field;
            if (values[id]) {
                // create content history for change
                /*contentUpdates.push({
                    type: "value",
                    fieldId: field.id,
                    change: {
                        ...(field.value && { from: field.value }),
                        to: values[id],
                    },
                    fieldName: field.name,

                    note: null,
                });*/

                if (field.type === "relation" && values[id]["value"]) {
                    await updateRelationValue({
                        field,
                        value: values[id]["value"],
                        userId,
                        content,
                    });
                }

                return {
                    ...field,
                    lastEditedBy: userId,
                    lastEditedAt: new Date().toISOString(),
                    ...(values[id]["value"] && { value: values[id]["value"] }),
                    ...(values[id]["note"] && { note: values[id]["note"] }),
                    ...(values[id]["assets"] && { assets: values[id]["assets"] }),
                };
            }
            return field;
        })
    )) as unknown as ContentField[];
    content.fields = updatedFields;
    await content.saveWithHistory({ editedBy: userId, title: "Values Updated" });
    return content;
}

//* Repeat Group */
export async function repeatGroup(props: { contentId: string; groupId: string; userId: string }) {
    const { contentId, groupId, userId } = props;
    errorIfUndefined({ contentId, groupId, userId });

    const { content } = await getContentById(contentId);
    if (!content) throw new Error("Content entry not found");

    /** Group id is for parent of repeated group instances */
    const { nestedFields, newGroup, nestedGroups } = duplicateGroup({
        content,
        groupId,
        userId,
    });

    console.log("newFields", nestedFields);
    console.log("newGroup", newGroup);
    console.log("newGroups", nestedGroups);

    content.fieldGroups.find(({ id }) => id === groupId)?.children.push(newGroup.id);
    content.fieldGroups.push(...nestedGroups, newGroup);
    content.fields.push(...nestedFields);

    await content.save();
    /*createRepeatableGroupInstance({
        content,
        groupId,
        userId,
    });*/
    return content;
}

//* Update content fields */
export async function updateContentFields(props: {
    contentId: string;
    updates?: ContentField[];
    deletions?: ContentField[];
    userId: string;
}) {
    const { contentId, userId, updates, deletions } = props;

    errorIfUndefined({ contentId, userId });
    const { content } = await getContentById(contentId);

    const contentUpdates: HistoryEntry[] = [];

    if (updates?.length) {
        const updateMap = objArrToKeyIndexedMap(updates, "id");
        const updatedFields = content.fields.map((field) => {
            const updatedField = updateMap.get(field.id);
            if (updatedField) {
                contentUpdates.push({
                    type: "property",
                    fieldId: field.id,
                    action: "updated",
                    fieldType: field.category,
                    fieldName: field.name,
                    changes: getObjectChanges(field, updatedField),
                });
                // delete from map after processed
                updateMap.delete(field.id);
                return updatedField;
            } else {
                return field;
            }
        });

        // should only have new fields remaining in map
        updateMap.forEach((field: Required<Partial<ContentField>, "name" | "category">) => {
            const newField = {
                ...fieldBaseValues({ userId, date: new Date().toISOString() }),
                ...field,
            };
            updatedFields.push(newField as ContentField);
            contentUpdates.push({
                type: "property",
                fieldId: ulid(),
                action: "created",
                fieldType: field.category,
                fieldName: field.name,
                changes: getObjectChanges({}, field),
            });
        });

        content.fields = updatedFields;
    }

    if (deletions?.length) {
        const deletionsMap = objArrToKeyIndexedMap(deletions, "id");
        deletions.forEach((deletion) => {
            contentUpdates.push({
                type: "property",
                fieldId: deletion.id,
                action: "deleted",
                fieldType: deletion.category,
                fieldName: deletion.name,
            });
        });
        content.fields = content.fields.filter(({ id }) => !deletionsMap.get(id));
    }

    await content.saveWithHistory({ editedBy: userId, title: "Fields Updated" });
    return content;
}

// To run when contentTemplate update event is fired
// Sets outdated to true and pushes update history to content entry
//* Set Content Outdated on Template change*/
/*export async function setContentOutdated({
    templateId,
    oldVersion,
    newVersion,
    historyEntry,
}: {
    templateId: string;
    oldVersion: string;
    newVersion: string;
    historyEntry: ContentTemplateHistory;
}) {
    const promises = [indexBy(ContentOutdated({ outdated: true, templateId })).get(Content)];
    if (oldVersion) {
        promises.push(
            indexBy(
                ContentVersion({ templateId, contentTemplateVersion: timekey(oldVersion) })
            ).get(Content)
        );
    }
    const outdatedContent = (await Promise.all(promises)).flat();
    await Promise.all(
        outdatedContent.map((content) => {
            content.outdated = true;
            content.templateUpdates.unshift(historyEntry);
            content.save();
        })
    );
}*/

/*export async function contentAndTemplateDifference({ templateId }: { templateId: string }) {
    const { content, contentTemplate } = await getContentOfTemplate({
        contentTemplateId: templateId,
    });
    const templateFieldMap = objArrToKeyIndexedMap(contentTemplate.properties, "id");

    content.forEach(({ fields }) => {
        const clonedMap = new Map(templateFieldMap);

        let contentFieldsNotOnTemplate: CleanedCamel<ContentField>[] = [];
        let templateFieldsNotOnContent: CleanedCamel<Property>[] = [];
        let updatedFields: {
            field: CleanedCamel<ContentField>;
            difference: Partial<CleanedCamel<ContentField>>;
        }[] = [];

        fields.forEach((field) => {
            // check if content field exists on template, and fetch
            const templateField = templateFieldMap.get(field.templateFieldId);
            if (!templateField) {
                // field exists on content, not on template
                contentFieldsNotOnTemplate.push(field);
                return;
            }

            const difference = diff(field, templateField) as CleanedCamel<ContentField>;

            // remove fields where difference not important
            const {
                id,
                templateFieldId,
                value,
                lastEditedBy,
                lastEditedTime,
                createdBy,
                createdTime,
                ...differs
            } = difference;

            Object.keys(differs).length && updatedFields.push({ field, difference: differs });

            // remove matching from map to leave fields with no content match
            clonedMap.delete(field.templateFieldId);
        });
        templateFieldMap.forEach((field) => templateFieldsNotOnContent.push(field));
    });
}*/

export async function handleContentTemplateChange({
    historyEntry,
    templateId,
}: {
    historyEntry: HistoryEntry;
    templateId: string;
}) {
    const { content, contentTemplate } = await getContentOfTemplate({
        contentTemplateId: templateId,
    });
    const { propertyUpdate } = historyEntry;
    // if a property has been updated need to make changes to content entries
    if (propertyUpdate && propertyUpdate.fieldType === "TemplateProperty") {
        const contentPromises = content.map((contentEntry) => {
            // initialise updates
            let updates: ContentField[] = [];

            // if property deleted on template change property category to additional
            if (propertyUpdate.action === "deleted") {
                const field = contentEntry.fields.find(
                    ({ templateFieldId }) => templateFieldId === propertyUpdate.fieldId
                );
                if (field) {
                    updates.push({
                        ...field,
                        // convert relation field to one way
                        ...(field.type === "relation" && {
                            isReciprocal: false,
                            reciprocalPropertyId: "",
                            reciprocalPropertyName: "",
                        }),
                        templateFieldId: "",
                        category: "additional",
                        required: false,
                        active: true,
                    });
                }
            }

            // if proprty added, add property to content but set as inactive
            if (propertyUpdate.action === "created") {
                const property = contentTemplate.properties.find(
                    ({ id }) => id === propertyUpdate.fieldId
                );
                if (property) {
                    const newProperty = fieldFromTemplateProperty({
                        property,
                        userId: historyEntry.userId,
                        date: new Date().toISOString(),
                        overrides: { active: false },
                    });
                    updates.push(newProperty);
                }
            }

            if (propertyUpdate.action === "updated") {
            }

            return updateContentFields({
                contentId: contentEntry.id,
                updates,
                userId: historyEntry.userId,
            });
        });
        await Promise.all(contentPromises);
    }
}

//* Update content from latest Template state //
export async function UpdateContentFromTemplate({
    contentId,
    userId,
}: {
    contentId: string;
    userId: string;
}) {
    const { content, contentTemplate } = await getContentById(contentId);
    errorIfUndefined({ content, contentTemplate, userId });

    // create hash map of contentFields indexed by field id
    const contentMap = content.fields.reduce<{ [fieldId: string]: ContentField }>((acc, curr) => {
        if (curr.templateFieldId) {
            return { ...acc, [curr.templateFieldId]: curr };
        } else {
            return acc;
        }
    }, {});

    const contentUpdates: ContentHistory["contentUpdates"] = [];

    const date = new Date().toISOString();
    // update field if exists on content, else create or remove
    content.fields = contentTemplate?.fields
        ? contentTemplate.properties.map((field) => {
              const fieldId = contentMap[field?.id]?.id ?? ulid();

              // if value doesn't exist for field and default value does
              // then field will be updated, so needs to be pushed to history
              if (!contentMap[field?.id]?.value && field.defaultValue) {
                  contentUpdates.push({
                      type: "value",
                      fieldId,
                      change: {
                          to: field.defaultValue,
                      },
                      note: "Set from default value",
                      fieldName: field.name,
                  });
              }
              return {
                  ...field,
                  id: fieldId,
                  templateFieldId: field?.id,
                  lastEditedTime: date,
                  lastEditedBy: userId,
                  createdBy: contentMap[field?.id]?.createdBy ?? userId,
                  createdTime: contentMap[field?.id]?.createdTime ?? date,
                  ...(contentMap[field?.id]?.value
                      ? { value: contentMap[field.id].value }
                      : field.defaultValue && { value: field.defaultValue }),
              };
          })
        : [];

    content.saveWithHistory({ editedBy: userId, title: "Updated from template" });
    return content;
}
