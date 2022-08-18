import { params } from "@serverless/cloud";
import structuredClone from "@ungap/structured-clone";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";
import { Required } from "utility-types";
import { IconPickerIcon } from "../../../components/ui/iconPicker/types";
import { withOrdinalSuffix } from "../../../utils/numbers";
import { getDifference } from "../../../utils/objects";
import { errorIfUndefined, errorRequiredPropsUndefined } from "../../utils";
import {
    ContentTemplate,
    ContentTemplateId,
    ContentTemplateOrganisation,
    ContentTemplateTitle,
} from "./contentTemplate.model";
import {
    createRelatedProperty,
    removeRelatedProperty,
    updateRelatedProperty,
} from "./functions/relation";
import { Property, PropertyRelation } from "./types";

const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create contentTemplate */
export async function createContentTemplate({
    name,
    icon,
    organisationId,
    userId,
    templateType,
}: {
    name: string;
    icon: IconPickerIcon;
    organisationId: string;
    userId: string;
    templateType: ContentTemplate["templateType"];
}) {
    errorIfUndefined({ name, userId, organisationId, icon, templateType });
    const date = new Date().toISOString();
    // create contentTemplate //
    const newContentTemplate = new ContentTemplate();
    newContentTemplate.name = name;
    newContentTemplate.icon = icon;
    newContentTemplate.status = "draft";
    newContentTemplate.templateType = templateType;
    newContentTemplate.id = ulid();
    newContentTemplate.createdTime = date;
    newContentTemplate.createdBy = userId;
    newContentTemplate.organisationId = organisationId;
    newContentTemplate.fields = [];
    newContentTemplate.history = [];
    newContentTemplate.title = {
        setType: "auto",
        type: "contentInfo",
        value: "id",
    };

    await newContentTemplate.saveWithHistory({
        userId,
        updateNotes: ["Content template created"],
        action: "created",
    });
    return newContentTemplate;
}

//* Get contentTemplate by id */
export async function getContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId });
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);
    return contentTemplate;
}

//* Get Organisation's contentTemplates */
export async function getOrganisationContentTemplates(organisationId: string) {
    errorIfUndefined({ organisationId });
    const contentTemplates = await indexBy(ContentTemplateOrganisation(organisationId)).get(
        ContentTemplate
    );
    return contentTemplates;
}

//* Delete contentTemplate by id */
export async function deleteContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId });
    // get contentTemplate
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    errorIfUndefined({ contentTemplate }, "notFound");

    await contentTemplate!.delete();

    return contentTemplate;
}

//* Update contentTemplate */
export async function updateContentTemplate({
    contentTemplateId,
    name,
    status,
    icon,
    title,
    userId,
}: {
    contentTemplateId: string;
    name?: string;
    status?: "archived" | "published";
    icon?: IconPickerIcon;
    title?: ContentTemplateTitle;
    userId: string;
}) {
    errorIfUndefined({ contentTemplateId, userId });
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);
    if (!contentTemplate) throw new Error("No content template found");
    let updateNotes: string[] = ["Template details updated"];

    // only one field updated on a single request

    if (status) {
        updateNotes = [`Status changed from ${contentTemplate.status} to ${status}`];
        contentTemplate.status = status;
        await contentTemplate.saveWithHistory({ action: status, userId });
        return;
    }

    let previousValue: any = "";
    let newValue: any = "";
    let fieldName: any = "";

    if (name) {
        previousValue = contentTemplate.name;
        newValue = name;
        fieldName = "name";
        contentTemplate.name = name;
    }

    if (icon) {
        previousValue = structuredClone(contentTemplate.icon);
        newValue = icon;
        fieldName = "icon";
        contentTemplate.icon = icon;
    }

    if (title) {
        previousValue = contentTemplate.title;
        newValue = title;
        fieldName = "title";
        contentTemplate.title = title;
    }

    await contentTemplate.saveWithHistory({
        action: "updated",
        userId,
        propertyUpdate: {
            fieldId: null,
            action: "updated",
            fieldName,
            fieldType: "TemplateInfo",
        },
    });

    return contentTemplate;
}

//* Create property */
export async function createProperty(props: {
    contentTemplateId: string;
    fieldProperties: Required<Partial<CleanedCamel<Property>>, "name" | "type">;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldProperties.name", "fieldProperties.type", "userId"],
    });

    const { contentTemplateId, fieldProperties, userId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const date = new Date().toISOString();
    const newProperty = {
        ...fieldProperties,
        id: ulid(),
        active: true,
        createdTime: date,
        createdBy: userId,
        lastEditedTime: date,
        lastEditedBy: userId,
    } as Property;

    // if reciprocal relation create property on related content Template
    if (
        newProperty.type === "relation" &&
        newProperty.isReciprocal &&
        !newProperty.reciprocalPropertyId
    ) {
        const relatedProperty = await createRelatedProperty({
            property: newProperty,
            templateId: contentTemplateId,
            userId,
        });
        if (relatedProperty as PropertyRelation) {
            newProperty.reciprocalPropertyId = relatedProperty.id;
            newProperty.reciprocalPropertyName = relatedProperty.name;
        }
    }

    contentTemplate.fields.push(newProperty);

    const changes = getDifference({}, fieldProperties);

    await contentTemplate.saveWithHistory({
        userId,
        action: "updated",
        propertyUpdate: {
            action: "created",
            fieldName: newProperty.name,
            fieldType: "TemplateProperty",
            changes,
            fieldId: newProperty.id,
        },
    });
    return { contentTemplate, property: newProperty };
}

//* Update property */
export async function updateProperty(props: {
    contentTemplateId: string;
    /** Updated properties */
    fieldProperties: Property;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldProperties.id", "userId"],
    });

    const { contentTemplateId, fieldProperties, userId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const fieldIndexToUpdate = contentTemplate.fields.findIndex(
        ({ id }) => id === fieldProperties.id
    );

    // remove id as to not overwrite, and type as that cannot be changed once created
    // values should not be different, but removed as safeguard
    const { id, type, ...updates } = fieldProperties;

    let property = contentTemplate.fields[fieldIndexToUpdate];

    let updatedProperty = { ...property, ...updates };

    if (property.type === "relation" && updatedProperty.type === "relation") {
        updatedProperty = await updateRelatedProperty({
            property: property,
            updatedProperty: updatedProperty as PropertyRelation,
            templateId: contentTemplateId,
            userId,
        });
    }

    const changes = getDifference(property, updatedProperty);

    // update field on content template
    contentTemplate.fields[fieldIndexToUpdate] = updatedProperty as Property;

    await contentTemplate.saveWithHistory({
        userId,
        action: "updated",
        propertyUpdate: {
            action: "updated",
            fieldName: property.name,
            fieldType: "TemplateProperty",
            changes,
            fieldId: property.id,
        },
    });

    return contentTemplate;
}

//* Reorder properties */
export async function reorderProperties(props: {
    contentTemplateId: string;
    fromIndex: number;
    toIndex: number;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fromIndex", "toIndex", "userId"],
    });

    const { contentTemplateId, fromIndex, toIndex, userId } = props;
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const clonedFields = [...contentTemplate.fields];
    const field = contentTemplate.fields[fromIndex];

    clonedFields.splice(fromIndex, 1);
    clonedFields.splice(toIndex, 0, field);

    // update field on content template
    contentTemplate.fields = clonedFields;

    const updateNotes = [
        `Properties reordered, '${field.name}' moved to ${withOrdinalSuffix(toIndex + 1)} position`,
    ];
    await contentTemplate.saveWithHistory({ userId, action: "updated", updateNotes });

    return contentTemplate;
}

//* Delete contentTemplate property */
export async function deleteProperty(props: {
    contentTemplateId: string;
    fieldId: string;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldId", "userId"],
    });

    const { contentTemplateId, fieldId, userId } = props;

    // get contentTemplate
    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    if (contentTemplate.fields.length === 1) {
        if (contentTemplate.status !== "draft") {
            throw new Error("Published templates must have at least one field");
        }
    }

    const propertyIndex = contentTemplate.fields.findIndex(({ id }) => id === fieldId);

    // remove field and return it
    const [property] = contentTemplate.fields.splice(propertyIndex, 1);

    if (property.type === "relation") {
        await removeRelatedProperty({
            property: property as PropertyRelation,
            userId,
        });
    }

    let updateNotes;

    // if removed field is title field
    if (
        contentTemplate.title.type === "contentProperty" &&
        contentTemplate.title.value === property.id
    ) {
        contentTemplate.title = {
            setType: "auto",
            type: "contentInfo",
            value: "id",
        };
        updateNotes = ["Title field removed, title value automatically set to id"];
    }

    await contentTemplate.saveWithHistory({
        userId,
        action: "updated",
        propertyUpdate: {
            action: "deleted",
            fieldName: property.name,
            fieldType: "TemplateProperty",
            fieldId: property.id,
        },
    });

    return contentTemplate;
}
