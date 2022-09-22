import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";
import { splitCamel } from "../../../../utils/stringTransform";
import { ContentTemplate, ContentTemplateId } from "../collection.model";
import { PropertyRelation } from "../types";
import { createProperty } from "..";

export const createRelatedProperty = async ({
    property,
    templateId,
    userId,
}: {
    property: PropertyRelation;
    templateId: string;
    userId: string;
}) => {
    const properties: Required<Partial<CleanedCamel<PropertyRelation>>, "name" | "type"> = {
        permissions: property.permissions,
        type: "relation",
        name: property.reciprocalPropertyName!,
        isReciprocal: true,
        relatedTo: templateId,
        reciprocalPropertyId: property.id,
        reciprocalPropertyName: property.name,
    };
    const { property: relatedProperty } = await createProperty({
        contentTemplateId: property.relatedTo,
        fieldProperties: properties,
        userId,
    });
    return relatedProperty;
};

export const updateRelatedProperty = async ({
    property,
    updatedProperty,
    templateId,
    userId,
}: {
    property: PropertyRelation;
    updatedProperty: PropertyRelation;
    templateId: string;
    userId: string;
}) => {
    const reciprocalChangedToTrue = updatedProperty.isReciprocal && !property.isReciprocal;
    const reciprocalChangedToFalse =
        updatedProperty.isReciprocal === false && property.isReciprocal;
    const relatedToChanged =
        updatedProperty.relatedTo && updatedProperty.relatedTo !== property.relatedTo;
    const nameChanged = updatedProperty.name && updatedProperty.name !== property.name;
    const reciprocalPropertyNameChanged =
        updatedProperty.reciprocalPropertyName &&
        updatedProperty.reciprocalPropertyName !== property.reciprocalPropertyName;
    const isReciprocal = updatedProperty.isReciprocal;

    // delete relation field on related
    if (reciprocalChangedToFalse || relatedToChanged) {
        await removeRelatedProperty({ property, userId });
        delete updatedProperty.reciprocalPropertyId;
        if (reciprocalChangedToFalse) delete updatedProperty.reciprocalPropertyName;
    }

    // create new field on related
    if (reciprocalChangedToTrue || (relatedToChanged && isReciprocal)) {
        const related = await createRelatedProperty({
            property: updatedProperty,
            templateId,
            userId,
        });
        updatedProperty.reciprocalPropertyName = related?.name;
        updatedProperty.isReciprocal = true;
        updatedProperty.reciprocalPropertyId = related?.id;
    }

    // update names
    if (nameChanged || reciprocalPropertyNameChanged) {
        const relatedTemplate = await indexBy(ContentTemplateId)
            .exact(property.relatedTo)
            .get(ContentTemplate);
        if (!relatedTemplate) {
            throw new Error("No content template found");
        }
        const relatedPropertyIndex = relatedTemplate.fields.findIndex(
            ({ id }) => id === property.reciprocalPropertyId
        );

        // change reciprocalPropertyName on related
        if (nameChanged) {
            (relatedTemplate.fields[relatedPropertyIndex] as PropertyRelation) = {
                ...(relatedTemplate.fields[relatedPropertyIndex] as PropertyRelation),
                reciprocalPropertyName: updatedProperty.name,
            };
        }

        // update name of property on related
        if (reciprocalPropertyNameChanged) {
            relatedTemplate.fields[relatedPropertyIndex] = {
                ...relatedTemplate.fields[relatedPropertyIndex],
                name: updatedProperty.reciprocalPropertyName!,
            };
        }

        /*await relatedTemplate.saveWithHistory({
            userId,
            action: "updated",
            propertyUpdate: {
                action: "deleted",
                fieldName: relatedTemplate.fields[relatedPropertyIndex].name,
                fieldType: "TemplateProperty",
                fieldId: relatedTemplate.fields[relatedPropertyIndex].id,
            },
        });*/
    }
    return updatedProperty as PropertyRelation;
};

export const removeRelatedProperty = async ({
    property,
    userId,
}: {
    property: PropertyRelation;
    userId: string;
}) => {
    const relatedTemplate = await indexBy(ContentTemplateId)
        .exact(property.relatedTo)
        .get(ContentTemplate);
    if (!relatedTemplate) {
        throw new Error("No content template found");
    }
    const relationPropertyIndex = relatedTemplate.fields.findIndex(
        ({ id }) => id === property.reciprocalPropertyId
    );

    // check that property exists on related template
    if (relationPropertyIndex > -1) {
        // remove field and return it
        const [relatedProperty] = relatedTemplate.fields.splice(relationPropertyIndex, 1);

        await relatedTemplate.saveWithHistory({
            userId,
            action: "updated",
            propertyUpdate: {
                action: "deleted",
                fieldName: relatedProperty.name,
                fieldType: "TemplateProperty",
                fieldId: relatedProperty.id,
            },
        });
    }
};
