import { createRelation, removeRelation } from "../../../relation/data";
import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import { Content, ContentId } from "../content.model";
import { ContentFieldRelation } from "../types";
import { PropertyRelation } from "../../../../lib/contentTemplate/data/types";
import { getContentById, getContentFields } from "..";
import { ulid } from "ulid";
import { Field } from "../../../../lib/field/data/field.model";
import { arrayDifference } from "../../../../utils/array";

// if template has a reciprocal relation property but content has not yet been updated
// may need to selectively update the content to add relation field if referenced
// function generates field details to be saved on content entry
export const createRelationProperty = async ({
    property,
    userId,
    relatedContentId,
}: {
    property: PropertyRelation;
    userId: string;
    relatedContentId: string;
}) => {
    const { relatedTo, isReciprocal } = property;

    if (!isReciprocal || !relatedTo) return;

    // if isReciprocal create property on relation template
    const { contentTemplate } = await getContentById(relatedContentId);

    // find reciprocal relation field for content on template
    const relationProperty = contentTemplate?.fields.find((field) => {
        if (field.type === "relation") {
            return field.id === property.reciprocalPropertyId;
        }
        return false;
    });

    if (!relationProperty) throw new Error("No valid relation field found on content template");

    const date = new Date().toISOString();

    const newRelationProperty = {
        ...relationProperty,
        id: ulid(),
        templateFieldId: relationProperty.id,
        createdBy: userId,
        createdTime: date,
        lastEditedTime: date,
        lastEditedBy: userId,
    };

    return newRelationProperty as ContentFieldRelation;
};

// updates values on relation
export const updateRelationValue = async ({
    field,
    value,
    userId,
    content,
}: {
    field: CleanedCamel<Field<"relation">>;
    value: string[];
    userId: string;
    content: CleanedCamel<Content>;
}) => {
    const existingRelationIds = field.value;
    const updatedRelationIds = value;

    let removedRelationIds: string[] = [];
    let addedRelationIds: string[] = [];

    // find what id's have been removed and added
    if (existingRelationIds) {
        removedRelationIds = existingRelationIds.filter((id) => !updatedRelationIds.includes(id));

        addedRelationIds = updatedRelationIds.filter(
            (id: string) => !existingRelationIds.includes(id)
        );
    } else {
        addedRelationIds = updatedRelationIds;
    }

    // create/remove relation entries for content
    await Promise.all([
        ...removedRelationIds.map((id) =>
            removeRelation({ fieldId: field.id, relatedContentId: id })
        ),
        ...addedRelationIds.map((id) =>
            createRelation({
                userId,
                contentId: content.id,
                fieldId: field.id,
                relatedContentId: id,
            })
        ),
    ]);

    if (!field.isReciprocal) return;

    // create an object with id's of content as keys and required action
    const toRemove: Record<string, { action: "remove" }> = removedRelationIds.reduce(
        (a, c) => ({ ...a, [c]: { action: "remove" } }),
        {}
    );
    const toAdd: Record<string, { action: "add" }> = addedRelationIds.reduce(
        (a, c) => ({ ...a, [c]: { action: "add" } }),
        {}
    );
    const contentActions = { ...toRemove, ...toAdd };

    // if actions are required
    if (Object.keys(contentActions).length) {
        // fetch content entries from ids
        const relatedContentEntries = await Promise.all(
            [...addedRelationIds, ...removedRelationIds].map((contentId) =>
                indexBy(ContentId).exact(contentId).get(Content)
            )
        );

        // update reciprocal relation field on related content
        const relatedContentPromises = relatedContentEntries
            .map(async (relatedContent) => {
                if (relatedContent) {
                    // initialise var for storing promise which will create or delete relation instance
                    let relationActionPromise;

                    // whether to add of remove
                    const { action } = contentActions[relatedContent.id];

                    // find linked field on related
                    const relationFieldIndex = relatedContent.fields.findIndex(
                        ({ templateFieldId }) => templateFieldId === field.reciprocalPropertyId
                    );

                    let relationField = relatedContent.fields[relationFieldIndex];

                    const previousValue = relationField?.value ?? [];

                    // edge case
                    // if relation field doesn't exist on linked content it needs to be created
                    if (!relationField) {
                        const relationProperty = await createRelationProperty({
                            property: field as PropertyRelation,
                            userId,
                            relatedContentId: relatedContent.id,
                        });

                        if (!relationProperty) {
                            throw new Error("relation property not created successfully");
                        }
                        relatedContent.fields.push(relationProperty);

                        // relation field will be the last entry in fields array
                        relationField = relatedContent.fields.at(-1)!;
                    }

                    // if relation field is inactive set to active
                    if (!relationField.active) {
                        relationField.active = true;
                    }

                    if (action === "add") {
                        // append content id to linked field
                        relationField.value = [...previousValue, content.id];
                        console.log("relationField", relationField);
                        // create relation entry
                        relationActionPromise = createRelation({
                            userId,
                            contentId: relatedContent.id,
                            fieldId: relationField.id,
                            relatedContentId: content.id,
                        });
                    }

                    if (action === "remove" && previousValue) {
                        // remove contentId from linked field
                        relationField.value = previousValue.filter(
                            (id: string) => id !== content.id
                        );

                        // remove relation entry
                        relationActionPromise = removeRelation({
                            fieldId: relationField.id,
                            relatedContentId: content.id,
                        });
                    }

                    // history update on related content
                    const contentUpdates: ContentUpdateValue[] = [
                        {
                            type: "value",
                            fieldId: relationField.id,
                            change: {
                                ...(previousValue &&
                                    previousValue.length && { from: previousValue }),
                                to: relationField.value,
                            },
                            note: null,
                            fieldName: relationField.name,
                        },
                    ];

                    // return promise
                    return Promise.all([
                        relatedContent.saveWithHistory({
                            userId,
                            action: "updated",
                            contentUpdates,
                        }),
                        relationActionPromise,
                    ]);
                }
                return undefined;
            })
            .filter((value) => value);
        await Promise.all(relatedContentPromises);
    }
};

export const updateRelation = async ({
    field,
    prevField,
}: {
    field: CleanedCamel<Field<"relation">>;
    prevField: CleanedCamel<Field<"relation">>;
}) => {
    if (!field.isReciprocal || !field.parent) return;

    // get an array of id's removed or added from value array
    const changes = arrayDifference(field.value ?? [], prevField.value ?? []);
    if (!changes.length) return;

    /** update linked fields */
    // get all fields for each content entry id in value array
    const relatedContentFields = await Promise.all(changes.map((id) => getContentFields(id)));
    console.log("relatedContentFields", relatedContentFields);

    await Promise.all(
        relatedContentFields.reduce<Promise<void>[]>((acc, contentFields) => {
            const relatedField = contentFields.find(
                ({ reciprocalPropertyId }) => reciprocalPropertyId === field.templatePropertyId
            ) as Field<"relation">;

            //Todo check edge case where related field doesn't exist
            if (!relatedField) return acc;

            const index = field.value?.findIndex((id) => id === relatedField.parent);
            const indexOnRelated = relatedField.value
                ? relatedField.value.findIndex((id) => id === field.parent)
                : -1;

            // fields linked succesfully, or not linked at all
            if (
                (index !== -1 && indexOnRelated !== -1) ||
                (index === -1 && indexOnRelated === -1)
            ) {
                console.log("linked or unlinked");
                return acc;
            }

            // field links to related, related doesn't link back
            if (index !== -1 && indexOnRelated === -1) {
                console.log("points out");
                // add parent value to related
                relatedField.value = [
                    ...(relatedField.value ? relatedField.value : []),
                    field.parent!,
                ];
                acc.push(relatedField.save());
            }

            // related links to field, field doesn't link back
            if (index === -1 && indexOnRelated !== -1) {
                console.log("points back");
                // remove parent value from related
                relatedField.value!.splice(indexOnRelated, 1);
                acc.push(relatedField.save());
            }

            return acc;
        }, [])
    );
};

export const deleteRelation = async ({ field }: { field: CleanedCamel<Field<"relation">> }) => {
    if (!field.isReciprocal || !field.parent || !field?.value?.length) return;

    // get all fields for each content entry id in value array
    const relatedContentFields = await Promise.all(field.value.map((id) => getContentFields(id)));

    await Promise.all(
        relatedContentFields.reduce<Promise<void>[]>((acc, contentFields) => {
            const relatedField = contentFields.find(
                ({ reciprocalPropertyId }) => reciprocalPropertyId === field.templatePropertyId
            ) as Field<"relation">;

            if (!relatedField?.value) return acc;

            const indexOnRelated = relatedField.value.findIndex((id) => id === field.parent);

            // remove fied from related if exists
            if (indexOnRelated !== -1) {
                relatedField.value.splice(indexOnRelated, 1);
                acc.push(relatedField.save());
            }

            return acc;
        }, [])
    );
};
