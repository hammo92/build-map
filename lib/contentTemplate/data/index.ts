import { TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { params } from "@serverless/cloud";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";
import { Required } from "utility-types";
import { getObjectChanges } from "../../../utils/objects";
import { IconPickerIcon } from "../../../components/ui/iconPicker/types";
import { HistoryEntry } from "../../../lib/historyEntry/data/historyEntry.model";
import { withOrdinalSuffix } from "../../../utils/numbers";
import { capitalise, splitCamel } from "../../../utils/stringTransform";
import { errorIfUndefined, errorRequiredPropsUndefined } from "../../utils";
import {
    ContentTemplate,
    ContentTemplateId,
    ContentTemplateOrganisation,
    ContentTemplateTitle,
} from "./contentTemplate.model";
import {
    createGroup,
    deleteGroup,
    findParentGroup,
    reorderGroups,
    updateGroup,
} from "./functions/propertyGroup";
import {
    createRelatedProperty,
    removeRelatedProperty,
    updateRelatedProperty,
} from "./functions/relation";
import { Property, PropertyRelation } from "./types";
import { content } from "@lib/content/endpoints";

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

    // create contentTemplate //
    const newContentTemplate = new ContentTemplate({ userId });

    // set Content Template details
    newContentTemplate.name = name;
    newContentTemplate.icon = icon;
    newContentTemplate.status = "draft";
    newContentTemplate.templateType = templateType;
    newContentTemplate.organisationId = organisationId;
    newContentTemplate.fields = [];
    newContentTemplate.propertyGroups = [
        { id: "1", children: [], name: "root", repeatable: false, type: "propertyGroup" },
    ];
    newContentTemplate.title = {
        setType: "auto",
        type: "contentInfo",
        value: "id",
    };

    await newContentTemplate.saveWithHistory({
        editedBy: userId,
        title: `${name} content template created`,
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

    const historyEntry = new HistoryEntry({
        title: "",
        editedBy: userId,
    });

    if (status) {
        historyEntry.title = `${contentTemplate.name} ${status}`;
        historyEntry.subtitle = `${contentTemplate.status} to ${status}`;
        contentTemplate.status = status;
    }

    if (name) {
        historyEntry.title = `Name Updated`;
        historyEntry.subtitle = `${contentTemplate.name} to ${name}`;
        contentTemplate.name = name;
    }

    if (icon) {
        historyEntry.title = `Icon Changed`;
        historyEntry.changes = [
            {
                path: ["Icon"],
                from: contentTemplate.icon,
                to: icon,
                type: "icon",
            },
        ];
        contentTemplate.icon = icon;
    }

    if (title) {
        historyEntry.title = `Title Property Updated`;
        const getName = (title: ContentTemplate["title"]) => {
            if (title.type === "contentInfo") return splitCamel(title.value);
            return contentTemplate.fields.find(({ id }) => id === title.value)?.name;
        };
        historyEntry.subtitle = `${getName(contentTemplate.title)} to ${getName(title)}`;
        contentTemplate.title = title;
    }

    await contentTemplate.saveWithHistory({
        ...historyEntry,
    });

    return contentTemplate;
}

//* Create property */
export async function createProperty(props: {
    contentTemplateId: string;
    fieldProperties: Required<Partial<CleanedCamel<Property>>, "name" | "type">;
    userId: string;
    groupId?: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "fieldProperties.name", "fieldProperties.type", "userId"],
    });

    const { contentTemplateId, fieldProperties, userId, groupId } = props;

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

    // add to root group if no group specified
    contentTemplate?.propertyGroups
        ?.find(({ id }) => id === (groupId ?? "1"))
        ?.children.push(newProperty.id);

    //const changes = getDifference({}, fieldProperties);

    await contentTemplate.saveWithHistory({
        title: `${newProperty.name} Created`,
        subtitle: `Type: ${capitalise(newProperty.type)}`,
        editedBy: userId,
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

    const changes = getObjectChanges(property, updatedProperty);

    //console.log("changes", changes);

    // update field on content template
    contentTemplate.fields[fieldIndexToUpdate] = updatedProperty as Property;

    await contentTemplate.saveWithHistory({
        editedBy: userId,
        title: `${property.name} Updated`,
        changes,
    });

    return contentTemplate;
}

export interface CreatePropertyGroupProps {
    contentTemplateId: string;
    userId: string;
    name: string;
    parentId?: string;
}

//* Create Property Group */
export async function createPropertyGroup(props: CreatePropertyGroupProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "name", "userId"],
    });

    const { contentTemplateId, name, userId, parentId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const { updatedGroups, parent } = createGroup({
        contentTemplate,
        parentId,
        name,
    });

    contentTemplate.propertyGroups = updatedGroups;

    await contentTemplate.saveWithHistory({
        editedBy: userId,
        title: `Group created: ${name}`,
        ...(parentId && { subtitle: `In group ${parent.name}` }),
    });

    return contentTemplate;
}

export interface ReorderPropertyGroupsProps {
    contentTemplateId: string;
    userId: string;
    source: TreeSourcePosition;
    destination: TreeDestinationPosition;
}

//* Reorder Property Groups/Properties */
export async function reorderPropertyGroups(props: ReorderPropertyGroupsProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "source", "destination", "userId"],
    });

    const { contentTemplateId, source, destination, userId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const reordered = reorderGroups({ contentTemplate, destination, source });

    contentTemplate.propertyGroups = reordered.updatedGroups;

    const historyEntry = new HistoryEntry({
        title: "Groups updated",
        editedBy: userId,
        notes: [],
    });

    const movedToNewGroup = reordered.source.group !== reordered.destination.group;
    const itemType = reordered.item.type === "propertyGroup" ? "Group" : "Property";

    historyEntry.title = `${itemType} moved: ${reordered.item.name}`;
    if (movedToNewGroup) {
        historyEntry.subtitle = "Between groups";
        historyEntry.notes!.push(
            `From group:  ${reordered.source.group.name}`,
            `To group:  ${reordered.destination.group.name}`
        );
    } else {
        historyEntry.subtitle = `Inside group: ${reordered.source.group.name}`;
        historyEntry.notes!.push(
            `From position: ${reordered.source.index + 1}`,
            `To position: ${reordered.destination.index! + 1}`
        );
    }

    await contentTemplate.saveWithHistory(historyEntry);

    return contentTemplate;
}

export interface UpdatePropertyGroupProps {
    contentTemplateId: string;
    propertyGroupId: string;
    name?: string;
    repeatable?: boolean;
    userId: string;
}

//* Update Property Group */
export async function updatePropertyGroup(props: UpdatePropertyGroupProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "userId", "propertyGroupId"],
    });

    const { contentTemplateId, propertyGroupId, name, repeatable, userId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const { updatedGroup, index } = updateGroup({
        contentTemplate,
        groupId: propertyGroupId,
        repeatable,
        name,
    });

    const historyEntry = new HistoryEntry({
        title: "",
        editedBy: userId,
    });

    if (name) {
        historyEntry.title = `Group title changed`;
        historyEntry.subtitle = `${contentTemplate.propertyGroups[index].name} to ${name}`;
    }

    if (repeatable !== undefined) {
        historyEntry.title = `${contentTemplate.propertyGroups[index].name} set to ${
            repeatable ? "repeatable" : "non-repeatable"
        }`;
    }

    contentTemplate.propertyGroups.splice(index, 1, updatedGroup);

    await contentTemplate.saveWithHistory(historyEntry);

    return contentTemplate;
}

//* Delete Property Group */
export async function deletePropertyGroup(props: {
    contentTemplateId: string;
    groupId: string;
    deleteContents?: boolean;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["contentTemplateId", "groupId", "userId"],
    });

    const { contentTemplateId, groupId, deleteContents, userId } = props;

    const contentTemplate = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate);

    if (!contentTemplate) throw new Error("No content template found");

    const { fields, propertyGroups, removedFields, removedGroups, targetGroup } = deleteGroup({
        contentTemplate,
        groupId,
        deleteContents,
    });

    const historyEntry = new HistoryEntry({
        title: `Group Deleted: ${targetGroup.name} `,
        subtitle: `Contents ${deleteContents ? "deleted:" : "retained"}`,
        notes: [
            ...removedGroups.map(({ name }) => `Group deleted: ${name} `),
            ...removedFields.map(({ name }) => `Property deleted: ${name} `),
        ],
        editedBy: userId,
    });

    contentTemplate.fields = fields;
    contentTemplate.propertyGroups = propertyGroups;

    await contentTemplate.saveWithHistory(historyEntry);

    return contentTemplate;
}

//* Reorder properties */
//? Groups now used instead
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
    //await contentTemplate.saveWithHistory({ userId, action: "updated", updateNotes });

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

    const historyEntry = new HistoryEntry({
        title: `Property Deleted: ${property.name}`,
        editedBy: userId,
    });

    if (property.type === "relation") {
        await removeRelatedProperty({
            property: property as PropertyRelation,
            userId,
        });
        historyEntry.notes?.push("Related property deleted");
    }

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
        historyEntry.notes?.push("Property was used as template title, title reset to id");
    }

    //remove property from group
    const parentGroup = findParentGroup({
        propertyGroups: contentTemplate.propertyGroups,
        itemId: fieldId,
    });
    // find group index in parent's children array and remove it
    const groupIndex = parentGroup.children.indexOf(fieldId);
    parentGroup.children.splice(groupIndex, 1);

    await contentTemplate.saveWithHistory(historyEntry);

    return contentTemplate;
}
