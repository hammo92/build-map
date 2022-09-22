import { TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { params } from "@serverless/cloud";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";
import { Required } from "utility-types";
import { getObjectChanges } from "../../../utils/objects";
import { Icon } from "../../../components/ui/iconPicker/types";
import { HistoryEntry } from "../../historyEntry/data/historyEntry.model";
import { withOrdinalSuffix } from "../../../utils/numbers";
import { capitalise, splitCamel } from "../../../utils/stringTransform";
import { errorIfUndefined, errorRequiredPropsUndefined } from "../../utils";
import {
    Collection,
    CollectionId,
    CollectionOrganisation,
    CollectionTitle,
} from "./collection.model";
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

//* Create collection */
export async function createCollection({
    name,
    icon,
    organisationId,
    userId,
}: {
    name: string;
    icon: Icon;
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ name, userId, organisationId, icon });

    // create collection //
    const newCollection = new Collection({ userId });

    // set Content Template details
    newCollection.name = name;
    newCollection.icon = icon;
    newCollection.status = "draft";
    newCollection.organisationId = organisationId;
    newCollection.properties = [];
    newCollection.title = {
        setType: "auto",
        type: "contentInfo",
        value: "id",
    };

    await newCollection.saveWithHistory({
        editedBy: userId,
        title: `${name} content template created`,
    });
    return newCollection;
}

//* Get collection by id */
export async function getCollectionById(collectionId: string) {
    errorIfUndefined({ collectionId });
    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);
    return collection;
}

//* Get Organisation's collections */
export async function getOrganisationCollections(organisationId: string) {
    errorIfUndefined({ organisationId });
    const collections = await indexBy(CollectionOrganisation(organisationId)).get(Collection);
    return collections;
}

//* Delete collection by id */
export async function deleteCollectionById(collectionId: string) {
    errorIfUndefined({ collectionId });
    // get collection
    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    errorIfUndefined({ collection }, "notFound");

    await collection!.delete();

    return collection;
}

//* Update collection */
export async function updateCollection({
    collectionId,
    name,
    status,
    icon,
    title,
    userId,
}: {
    collectionId: string;
    name?: string;
    status?: "archived" | "published";
    icon?: Icon;
    title?: CollectionTitle;
    userId: string;
}) {
    errorIfUndefined({ collectionId, userId });
    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);
    if (!collection) throw new Error("No content template found");
    let updateNotes: string[] = ["Template details updated"];

    // only one field updated on a single request

    const historyEntry = new HistoryEntry({
        title: "",
        editedBy: userId,
    });

    if (status) {
        historyEntry.title = `${collection.name} ${status}`;
        historyEntry.subtitle = `${collection.status} to ${status}`;
        collection.status = status;
    }

    if (name) {
        historyEntry.title = `Name Updated`;
        historyEntry.subtitle = `${collection.name} to ${name}`;
        collection.name = name;
    }

    if (icon) {
        historyEntry.title = `Icon Changed`;
        historyEntry.changes = [
            {
                path: ["Icon"],
                from: collection.icon,
                to: icon,
                type: "icon",
            },
        ];
        collection.icon = icon;
    }

    if (title) {
        historyEntry.title = `Title Property Updated`;
        const getName = (title: Collection["title"]) => {
            if (title.type === "contentInfo") return splitCamel(title.value);
            return collection.fields.find(({ id }) => id === title.value)?.name;
        };
        historyEntry.subtitle = `${getName(collection.title)} to ${getName(title)}`;
        collection.title = title;
    }

    await collection.saveWithHistory({
        ...historyEntry,
    });

    return collection;
}

//* Create property */
export async function createProperty(props: {
    collectionId: string;
    fieldProperties: Required<Partial<CleanedCamel<Property>>, "name" | "type">;
    userId: string;
    groupId?: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "fieldProperties.name", "fieldProperties.type", "userId"],
    });

    const { collectionId, fieldProperties, userId, groupId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

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
            templateId: collectionId,
            userId,
        });
        if (relatedProperty as PropertyRelation) {
            newProperty.reciprocalPropertyId = relatedProperty.id;
            newProperty.reciprocalPropertyName = relatedProperty.name;
        }
    }

    collection.fields.push(newProperty);

    // add to root group if no group specified
    collection?.propertyGroups
        ?.find(({ id }) => id === (groupId ?? "1"))
        ?.children.push(newProperty.id);

    //const changes = getDifference({}, fieldProperties);

    await collection.saveWithHistory({
        title: `${newProperty.name} Created`,
        subtitle: `Type: ${capitalise(newProperty.type)}`,
        editedBy: userId,
    });
    return { collection, property: newProperty };
}

//* Update property */
export async function updateProperty(props: {
    collectionId: string;
    /** Updated properties */
    fieldProperties: Property;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "fieldProperties.id", "userId"],
    });

    const { collectionId, fieldProperties, userId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const fieldIndexToUpdate = collection.fields.findIndex(({ id }) => id === fieldProperties.id);

    // remove id as to not overwrite, and type as that cannot be changed once created
    // values should not be different, but removed as safeguard
    const { id, type, ...updates } = fieldProperties;

    let property = collection.fields[fieldIndexToUpdate];

    let updatedProperty = { ...property, ...updates };

    if (property.type === "relation" && updatedProperty.type === "relation") {
        updatedProperty = await updateRelatedProperty({
            property: property,
            updatedProperty: updatedProperty as PropertyRelation,
            templateId: collectionId,
            userId,
        });
    }

    const changes = getObjectChanges(property, updatedProperty);

    //console.log("changes", changes);

    // update field on content template
    collection.fields[fieldIndexToUpdate] = updatedProperty as Property;

    await collection.saveWithHistory({
        editedBy: userId,
        title: `${property.name} Updated`,
        changes,
    });

    return collection;
}

export interface CreatePropertyGroupProps {
    collectionId: string;
    userId: string;
    name: string;
    parentId?: string;
}

//* Create Property Group */
export async function createPropertyGroup(props: CreatePropertyGroupProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "name", "userId"],
    });

    const { collectionId, name, userId, parentId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const { updatedGroups, parent } = createGroup({
        collection,
        parentId,
        name,
    });

    collection.propertyGroups = updatedGroups;

    await collection.saveWithHistory({
        editedBy: userId,
        title: `Group created: ${name}`,
        ...(parentId && { subtitle: `In group ${parent.name}` }),
    });

    return collection;
}

export interface ReorderPropertyGroupsProps {
    collectionId: string;
    userId: string;
    source: TreeSourcePosition;
    destination: TreeDestinationPosition;
}

//* Reorder Property Groups/Properties */
export async function reorderPropertyGroups(props: ReorderPropertyGroupsProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "source", "destination", "userId"],
    });

    const { collectionId, source, destination, userId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const reordered = reorderGroups({ collection, destination, source });

    collection.propertyGroups = reordered.updatedGroups;

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

    await collection.saveWithHistory(historyEntry);

    return collection;
}

export interface UpdatePropertyGroupProps {
    collectionId: string;
    propertyGroupId: string;
    name?: string;
    repeatable?: boolean;
    userId: string;
}

//* Update Property Group */
export async function updatePropertyGroup(props: UpdatePropertyGroupProps) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "userId", "propertyGroupId"],
    });

    const { collectionId, propertyGroupId, name, repeatable, userId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const { updatedGroup, index } = updateGroup({
        collection,
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
        historyEntry.subtitle = `${collection.propertyGroups[index].name} to ${name}`;
    }

    if (repeatable !== undefined) {
        historyEntry.title = `${collection.propertyGroups[index].name} set to ${
            repeatable ? "repeatable" : "non-repeatable"
        }`;
    }

    collection.propertyGroups.splice(index, 1, updatedGroup);

    await collection.saveWithHistory(historyEntry);

    return collection;
}

//* Delete Property Group */
export async function deletePropertyGroup(props: {
    collectionId: string;
    groupId: string;
    deleteContents?: boolean;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "groupId", "userId"],
    });

    const { collectionId, groupId, deleteContents, userId } = props;

    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const { fields, propertyGroups, removedFields, removedGroups, targetGroup } = deleteGroup({
        collection,
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

    collection.fields = fields;
    collection.propertyGroups = propertyGroups;

    await collection.saveWithHistory(historyEntry);

    return collection;
}

//* Reorder properties */
//? Groups now used instead
export async function reorderProperties(props: {
    collectionId: string;
    fromIndex: number;
    toIndex: number;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "fromIndex", "toIndex", "userId"],
    });

    const { collectionId, fromIndex, toIndex, userId } = props;
    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    const clonedFields = [...collection.fields];
    const field = collection.fields[fromIndex];

    clonedFields.splice(fromIndex, 1);
    clonedFields.splice(toIndex, 0, field);

    // update field on content template
    collection.fields = clonedFields;

    const updateNotes = [
        `Properties reordered, '${field.name}' moved to ${withOrdinalSuffix(toIndex + 1)} position`,
    ];
    //await collection.saveWithHistory({ userId, action: "updated", updateNotes });

    return collection;
}

//* Delete collection property */
export async function deleteProperty(props: {
    collectionId: string;
    fieldId: string;
    userId: string;
}) {
    errorRequiredPropsUndefined({
        props,
        propPaths: ["collectionId", "fieldId", "userId"],
    });

    const { collectionId, fieldId, userId } = props;

    // get collection
    const [collection] = await indexBy(CollectionId).exact(collectionId).get(Collection);

    if (!collection) throw new Error("No content template found");

    if (collection.fields.length === 1) {
        if (collection.status !== "draft") {
            throw new Error("Published templates must have at least one field");
        }
    }

    const propertyIndex = collection.fields.findIndex(({ id }) => id === fieldId);

    // remove field and return it
    const [property] = collection.fields.splice(propertyIndex, 1);

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
    if (collection.title.type === "contentProperty" && collection.title.value === property.id) {
        collection.title = {
            setType: "auto",
            type: "contentInfo",
            value: "id",
        };
        historyEntry.notes?.push("Property was used as template title, title reset to id");
    }

    //remove property from group
    const parentGroup = findParentGroup({
        propertyGroups: collection.propertyGroups,
        itemId: fieldId,
    });
    // find group index in parent's children array and remove it
    const groupIndex = parentGroup.children.indexOf(fieldId);
    parentGroup.children.splice(groupIndex, 1);

    await collection.saveWithHistory(historyEntry);

    return collection;
}
