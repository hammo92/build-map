import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { getAssetById } from "../../../lib/asset/data";
import { getContentTemplateById } from "../../contentTemplate/data";
import { errorIfUndefined } from "../../utils";
import {
    Content,
    ContentHistory,
    ContentId,
    ContentStatus,
    ContentTemplate,
} from "./content.model";
import { ContentField } from "./types";
/*import {
    ContentTemplateHistory,
    ContentTemplate as ContentTemplateModel,
} from "../../../lib/contentTemplate/data/contentTemplate.model";*/
import {
    ContentTemplateHistoryEntry,
    PropertyUpdate,
} from "../../contentTemplate/data/contentTemplate.model";
import { Property } from "../../contentTemplate/data/types";
import { diff } from "deep-object-diff";
import { CleanedCamel } from "type-helpers";
import { deleteAllContentRelations } from "../../../lib/relation/data";
import { objArrToKeyIndexedMap } from "../../../utils/arrayModify";
import { updateRelationValue } from "./functions/relation";
import { getDifference } from "../../../utils/objects";

function fieldFromTemplateProperty({
    property,
    userId,
    date,
    overrides,
}: {
    property: Property;
    userId: string;
    date: string;
    overrides?: Partial<ContentField>;
}) {
    return {
        ...property,
        ...(property.defaultValue && { value: property?.defaultValue }),
        id: ulid(),
        category: "template",
        active: true,
        templateFieldId: property.id,
        createdBy: userId,
        createdTime: date,
        lastEditedTime: date,
        lastEditedBy: userId,
        ...overrides,
    };
}

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

    // initialise array for properties with default values for content history
    const propertyValuesUpdates: ContentHistory["propertyValuesUpdates"] = [];
    // create contentTemplate //
    const newContent = new Content();
    newContent.contentTemplateId = contentTemplateId;
    newContent.projectId = projectId;
    newContent.status = "draft";
    newContent.id = ulid();
    newContent.createdBy = userId;
    newContent.createdTime = date;
    newContent.templateUpdates = [];
    newContent.history = [];
    newContent.fields = contentTemplate.fields.map((property) => {
        const field = fieldFromTemplateProperty({ property, userId, date });
        if (field.value) {
            propertyValuesUpdates.push({
                fieldId: field.id,
                value: field?.value,
                note: "Set from default value",
                previousValue: null,
            });
        }
        return field;
    });
    console.log("newContent", newContent);
    await newContent.saveWithHistory({ userId, action: "created", propertyValuesUpdates });
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
    const content = await indexBy(ContentId).exact(contentId).get(Content);
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
    const content = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) throw new Error("No content found");

    if (status) {
        content.status = status;
        if (status === "archived" || status === "published") {
            content.saveWithHistory({ action: status, userId });
        }
    }

    return content;
}

//* Delete content by id */
export async function deleteContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const content = await indexBy(ContentId).exact(contentId).get(Content);
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
    values: { [fieldId: string]: ContentField["value"] };
    userId: string;
}) {
    const { contentId, values, userId } = props;
    errorIfUndefined({ contentId, userId, values });

    // initialise array for properties for content history
    const propertyValuesUpdates: ContentHistory["propertyValuesUpdates"] = [];

    const { content } = await getContentById(contentId);

    if (!content) throw new Error("No content found");

    const updatedFields = (await Promise.all(
        content.fields.map(async (field) => {
            const { id } = field;
            if (values[id]) {
                // create content history for change
                propertyValuesUpdates.push({
                    fieldId: field.id,
                    previousValue: field.value ?? null,
                    value: values[id],
                    note: null,
                });

                if (field.type === "relation") {
                    await updateRelationValue({
                        field,
                        value: values[id],
                        userId,
                        content,
                    });
                }

                return {
                    ...field,
                    lastEditedBy: userId,
                    lastEditedAt: new Date().toISOString(),
                    value: values[id],
                };
            }
            return field;
        })
    )) as unknown as ContentField[];
    content.fields = updatedFields;
    await content.saveWithHistory({ userId, action: "updated", propertyValuesUpdates });
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
    console.log("updates :>> ", updates);
    const propertyUpdates: ContentHistory["propertyUpdates"] = [];
    if (updates?.length) {
        const updateMap = objArrToKeyIndexedMap(updates, "id");

        const updatedFields = content.fields.map((field) => {
            const updatedField = updateMap.get(field.id);
            if (updatedField) {
                propertyUpdates.push({
                    fieldId: field.id,
                    action: "updated",
                    fieldType: field.category,
                    fieldName: field.name,
                    changes: getDifference(field, updatedField),
                });
                // delete from map after processed
                updateMap.delete(field.id);
                return updatedField;
            } else {
                return field;
            }
        });

        // should only have new fields remaining in map
        updateMap.forEach((field) => {
            updatedFields.push(field);
            propertyUpdates.push({
                fieldId: field.id,
                action: "created",
                fieldType: field.category,
                fieldName: field.name,
                changes: getDifference({}, field),
            });
        });

        content.templateFields = updatedFields;
    }

    if (deletions?.length) {
        const deletionsMap = objArrToKeyIndexedMap(deletions, "id");
        deletions.forEach((deletion) => {
            propertyUpdates.push({
                fieldId: deletion.id,
                action: "deleted",
                fieldType: deletion.category,
                fieldName: deletion.name,
            });
        });
        content.templateFields = content.templateFields.filter(({ id }) => !deletionsMap.get(id));
    }

    await content.saveWithHistory({ action: "updated", userId, propertyUpdates });
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

export async function contentAndTemplateDifference({ templateId }: { templateId: string }) {
    const { content, contentTemplate } = await getContentOfTemplate({
        contentTemplateId: templateId,
    });
    const templateFieldMap = objArrToKeyIndexedMap(contentTemplate.fields, "id");

    content.forEach(({ templateFields }) => {
        const clonedMap = new Map(templateFieldMap);

        let contentFieldsNotOnTemplate: CleanedCamel<ContentField>[] = [];
        let templateFieldsNotOnContent: CleanedCamel<Property>[] = [];
        let updatedFields: {
            field: CleanedCamel<ContentField>;
            difference: Partial<CleanedCamel<ContentField>>;
        }[] = [];

        templateFields.forEach((field) => {
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
        console.log("contentFieldsNotOnTemplate :>> ", contentFieldsNotOnTemplate);
        console.log("templateFieldsNotOnContent :>> ", templateFieldsNotOnContent);
        console.log("updatedFields :>> ", updatedFields);
    });
}

export async function handleContentTemplateChange({
    historyEntry,
    templateId,
}: {
    historyEntry: ContentTemplateHistoryEntry;
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
                const field = contentEntry.templateFields.find(
                    ({ templateFieldId }) => templateFieldId === propertyUpdate.fieldId
                );
                if (field) {
                    updates.push({
                        ...field,
                        category: "additional",
                        required: false,
                        active: true,
                    });
                }
            }

            // if proprty added, add property to content but set as inactive
            if (propertyUpdate.action === "created") {
                const property = contentTemplate.fields.find(
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
        return { ...acc, [curr.templateFieldId]: curr };
    }, {});

    // initialise array for properties with default values for content history
    const propertyValuesUpdates: ContentHistory["propertyValuesUpdates"] = [];

    const date = new Date().toISOString();
    console.log("contentMap", contentMap);
    // update field if exists on content, else create or remove
    content.fields = contentTemplate?.fields
        ? contentTemplate.fields.map((field) => {
              const fieldId = contentMap[field?.id]?.id ?? ulid();

              // if value doesn't exist for field and default value does
              // then field will be updated, so needs to be pushed to history
              if (!contentMap[field?.id]?.value && field.defaultValue) {
                  propertyValuesUpdates.push({
                      fieldId,
                      value: field.defaultValue,
                      previousValue: null,
                      note: "Set from default value",
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

    content.outdated = false;
    content.templateUpdates = [];
    content.saveWithHistory({
        action: "updated",
        userId,
        propertyValuesUpdates,
        notes: ["Updated from content template"],
    });
    return content;
}
