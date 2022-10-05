import { Property } from "@lib/field/data/field.model";
import structuredClone from "@ungap/structured-clone";
import pluralize from "pluralize";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { createProperty, updateProperties } from "..";
import { ContentTemplate, ContentTemplateId } from "../contentTemplate.model";

export const createRelatedProperty = async ({
    property,
    userId,
    templateId,
}: {
    property: Property<"relation">;
    userId: string;
    templateId: string;
}): Promise<Property<"relation"> | undefined> => {
    const { isReciprocal, reciprocalPropertyId, reciprocalPropertyName, relatedTo } = property;

    // if reciprocalPropertyId is set then linked content has already been created
    // if not reciprocal then no linked field needed
    if (reciprocalPropertyId || !isReciprocal) return;
    if (!relatedTo) throw new Error("No relation found");

    const [relatedTemplate] = await indexBy(ContentTemplateId)
        .exact(relatedTo)
        .get(ContentTemplate);

    if (!relatedTemplate) throw new Error("No related content template found");

    // create new property
    const relation = await createProperty({
        type: "relation",
        name: reciprocalPropertyName ?? pluralize(property.name),
        userId,
        templateId,
        propertyDetails: {
            reciprocalPropertyId: property.id,
            isReciprocal: true,
            reciprocalPropertyName: property.name,
            parent: "1",
            relatedTo: templateId,
            id: ulid(),
        },
    });

    relatedTemplate.properties.push(relation);
    relatedTemplate.propertyGroups.find(({ id }) => id === "1")?.children.push(relation.id);

    // save property on linked template
    await relatedTemplate.save();

    return { ...property, reciprocalPropertyId: relation.id };
};

export const updateRelatedProperty = async ({
    property,
    userId,
}: {
    property: Property<"relation">;
    userId: string;
}) => {
    const [relatedTemplate] = await indexBy(ContentTemplateId)
        .exact(property.relatedTo)
        .get(ContentTemplate);

    if (!relatedTemplate) throw new Error("No related content template found");

    // find related property if exists on related template
    const relatedPropertyIndex = relatedTemplate.properties.findIndex((relatedTemplateProperty) => {
        if (relatedTemplateProperty.type === "relation") {
            return relatedTemplateProperty.reciprocalPropertyId === property.id;
        }
        return false;
    });

    // if there is no related property no changes needed
    if (relatedPropertyIndex === -1) return;

    // remove link if changed to non recoprocal remove related property
    if (!property.isReciprocal) {
        const relatedProperty = relatedTemplate.properties[
            relatedPropertyIndex
        ] as Property<"relation">;
        await updateProperties({
            contentTemplateId: relatedTemplate.id,
            deletedProperties: { [relatedProperty.id]: relatedProperty },
            userId,
        });
        return;
    }

    const clone = structuredClone(relatedTemplate.properties[relatedPropertyIndex]);

    if (property.name !== clone.reciprocalPropertyName) {
        clone.reciprocalPropertyName = property.name;
    }

    if (property.reciprocalPropertyName && property.reciprocalPropertyName !== clone.name) {
        clone.name = property.reciprocalPropertyName;
    }

    relatedTemplate.properties[relatedPropertyIndex] = clone;
    await relatedTemplate.save();
};
