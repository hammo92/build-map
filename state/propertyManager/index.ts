import { ItemId, TreeData, TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { transformToTree } from "@components/property/property-list/utils/dataTransform";
import { FieldTypes, Property, PropertyGroup } from "@lib/field/data/field.model";
import { showNotification } from "@mantine/notifications";
import structuredClone from "@ungap/structured-clone";
import equal from "fast-deep-equal";
import memoize from "proxy-memoize";
import { Writable } from "type-fest";
import { ulid } from "ulid";
import { Required } from "utility-types";
import { objArrayToHashmap } from "utils/arrayModify";
import { proxyWithComputed } from "valtio/utils";

export type PartialProperty = Required<Partial<Property>, "type" | "name">;
interface PropertyManagerProps {
    propertyMap: Record<string, PartialProperty>;
    propertyMapInitial: Record<string, PartialProperty>;

    propertyGroupMap: Record<string, PropertyGroup>;
    propertyGroupMapInitial: Record<string, PropertyGroup>;

    createdProperties: Record<string, PartialProperty>;
    updatedProperties: Record<string, PartialProperty>;
    deletedProperties: Record<string, PartialProperty>;

    createdGroups: Record<string, PropertyGroup>;
    updatedGroups: Record<string, PropertyGroup>;
    deletedGroups: Record<string, PropertyGroup>;

    collapsed: Record<string, boolean>;
    editing: boolean;
}

interface PropertyManagerInitialProps {
    propertyMapInitial: Record<string, PartialProperty>;
    propertyGroupMapInitial: Record<string, PropertyGroup>;
}

const showError = (message: string) =>
    showNotification({
        title: "Error",
        message,
        color: "red",
    });

const objHasEntries = (obj: Record<any, any>) => !!Object.keys(obj).length;

export const propertyManager = proxyWithComputed<
    PropertyManagerProps,
    { tree: TreeData; changed: boolean }
>(
    {
        propertyMap: {},
        propertyMapInitial: {},

        propertyGroupMap: {},
        propertyGroupMapInitial: {},

        createdProperties: {},
        updatedProperties: {},
        deletedProperties: {},

        createdGroups: {},
        updatedGroups: {},
        deletedGroups: {},

        collapsed: {},
        editing: true,
    },
    {
        tree: memoize((snap) =>
            transformToTree({
                collapsed: snap.collapsed,
                properties: Object.values(snap.propertyMap) as Writable<Property[]>,
                propertyGroups: Object.values(snap.propertyGroupMap) as Writable<PropertyGroup[]>,
            })
        ),
        changed: memoize(
            (snap) =>
                objHasEntries(snap.createdProperties) ||
                objHasEntries(snap.updatedProperties) ||
                objHasEntries(snap.deletedProperties) ||
                objHasEntries(snap.createdGroups) ||
                objHasEntries(snap.updatedGroups) ||
                objHasEntries(snap.deletedGroups)
        ),
    }
);

export const initiateState = ({
    properties,
    propertyGroups,
}: {
    properties: Property[];
    propertyGroups: PropertyGroup[];
}) => {
    const propertyMap = objArrayToHashmap(properties, "id");
    const groupMap = objArrayToHashmap(propertyGroups, "id");

    // need to be deep cloned to avoid children being updated by reference
    propertyManager.propertyMapInitial = structuredClone(propertyMap);
    propertyManager.propertyGroupMapInitial = structuredClone(groupMap);

    propertyManager.propertyMap = propertyMap;
    propertyManager.propertyGroupMap = groupMap;
};

export const resetState = () => {
    propertyManager.propertyMap = {};
    propertyManager.propertyMapInitial = {};

    propertyManager.propertyGroupMap = {};
    propertyManager.propertyGroupMapInitial = {};

    propertyManager.createdProperties = {};
    propertyManager.updatedProperties = {};
    propertyManager.deletedProperties = {};

    propertyManager.createdGroups = {};
    propertyManager.updatedGroups = {};
    propertyManager.deletedGroups = {};

    propertyManager.collapsed = {};
    propertyManager.editing = true;
};

const updateGroup = ({
    groupId,
    newConfig,
}: {
    groupId: string;
    newConfig: Partial<PropertyGroup>;
}) => {
    const { propertyGroupMap, updatedGroups, propertyGroupMapInitial, createdGroups } =
        propertyManager;
    const group = propertyGroupMap[groupId];

    if (!group) {
        showError("Could not update group");
    }

    const updatedGroup = {
        ...group,
        ...newConfig,
    };

    //check if group matches initial state
    if (equal(updatedGroup, propertyGroupMapInitial[groupId])) {
        // if equal removed from updated
        delete updatedGroups[groupId];
    } else if (createdGroups[groupId]) {
        createdGroups[groupId] = updatedGroup;
    } else {
        // else add changed group to updated
        updatedGroups[groupId] = updatedGroup;
    }

    // update in state either way
    propertyGroupMap[groupId] = updatedGroup;
};

const updateProperty = ({
    propertyId,
    newConfig,
}: {
    propertyId: string;
    newConfig: Partial<Property>;
}) => {
    const { propertyMap, updatedProperties, propertyMapInitial, createdProperties } =
        propertyManager;
    const property = propertyMap[propertyId];
    if (!property) {
        showError("Could not update property");
    }
    const updatedProperty = {
        ...property,
        ...newConfig,
    };

    //check if property matches initail state
    if (equal(updatedProperty, propertyMapInitial[propertyId])) {
        // if equal removed from updated
        delete updatedProperties[propertyId];
    } else if (createdProperties[propertyId]) {
        createdProperties[propertyId] = updatedProperty;
    } else {
        // else add changed group to updated
        updatedProperties[propertyId] = updatedProperty;
    }

    // update in state either way
    propertyMap[propertyId] = updatedProperty;
};

export const createProperty = <T extends FieldTypes>({
    type,
    name,
    parentId = "1",
    ...propertyDetails
}: {
    type: T;
    name: string;
    parentId: string;
    propertyDetails: Partial<Omit<Property<T>, "name" | "type">>;
}) => {
    const { propertyMap, propertyGroupMap, createdProperties } = propertyManager;
    const parent = propertyGroupMap[parentId];
    const property = {
        type,
        name,
        id: ulid(),
        parent: parentId,
        ...propertyDetails,
    };
    propertyMap[property.id] = property;
    createdProperties[property.id] = property;
    updateGroup({ groupId: parentId, newConfig: { children: [...parent.children, property.id] } });
};

export const updatePropertyDetails = ({
    propertyId,
    property,
}: {
    propertyId: string;
    property: Property;
}) => {
    const { propertyMap, updatedProperties, propertyMapInitial } = propertyManager;
    if (!propertyMap[propertyId]) {
        showError("Could not update property");
    }
    updateProperty({ propertyId, newConfig: property });
};

export const deleteProperty = (propertyId: string) => {
    const {
        propertyMap,
        propertyGroupMap,
        createdProperties,
        deletedProperties,
        updatedProperties,
    } = propertyManager;
    const property = propertyMap[propertyId];
    if (!property) {
        showError("Couldn't delete property");
        return;
    }

    const parent = propertyGroupMap[property.parent ?? 1];

    // update parent group
    updateGroup({
        groupId: `${parent.id}`,
        newConfig: { children: parent.children.filter((id) => id !== propertyId) },
    });

    // remove property form state
    delete updatedProperties[propertyId];
    delete propertyMap[propertyId];

    // if new property remove from created
    if (createdProperties[propertyId]) {
        delete createdProperties[propertyId];
    } else {
        deletedProperties[propertyId] = propertyMap[propertyId];
    }
};

export const createGroup = ({ name, parentId = "1" }: { name: string; parentId?: string }) => {
    const { propertyGroupMap, collapsed, createdGroups, updatedGroups } = propertyManager;
    const id = ulid();
    const newGroup = {
        id,
        children: [],
        hasChildren: true,
        repeatable: false,
        name,
        type: "propertyGroup",
        parent: parentId,
    } as PropertyGroup;

    collapsed[newGroup.id] = false;

    propertyGroupMap[id] = newGroup;
    createdGroups[id] = newGroup;

    // update children on parent
    const parentGroup = propertyGroupMap[parentId];
    updateGroup({
        groupId: parentId,
        newConfig: { children: [...parentGroup.children, newGroup.id] },
    });
};

export const deleteGroup = ({
    groupId,
    deleteContents = false,
}: {
    groupId: string;
    deleteContents?: boolean;
}) => {
    const { propertyGroupMap, propertyMap, updatedGroups, createdGroups, deletedGroups } =
        propertyManager;
    const group = propertyGroupMap[groupId];

    if (!group) {
        showError("Couldn't delete group");
        return;
    }

    // remove group from parent
    const parentGroup = propertyGroupMap[group?.parent ?? "1"];

    /*updateGroup({
        groupId: group?.parent ?? "1",
        newConfig: { children: [...parentGroup.children.filter((id) => id !== groupId)] },
    });*/

    // move children into parent if keeping contents
    if (!deleteContents) {
        updateGroup({
            groupId: `${parentGroup.id}`,
            newConfig: {
                children: [
                    ...parentGroup.children.filter((id) => id !== groupId),
                    ...group.children,
                ],
            },
        });

        updateGroup({
            groupId: `${group.id}`,
            newConfig: { parent: parentGroup.parent },
        });

        // remove group and any update values
        delete propertyGroupMap[group.id];
        delete updatedGroups[group.id];
        if (createdGroups[group.id]) {
            delete createdGroups[group.id];
        } else {
            deletedGroups[group.id] = group;
        }
    } else {
        updateGroup({
            groupId: `${parentGroup.id}`,
            newConfig: {
                children: [...parentGroup.children.filter((id) => id !== groupId)],
            },
        });

        // recursively delete groups and children
        const deleteGroupAndChildren = (propertyGroup: PropertyGroup) => {
            propertyGroup.children.forEach((id) => {
                const property = propertyMap[id];
                if (property) {
                    // remove property and any update values
                    deleteProperty(`${id}`);
                    return;
                }
                const group = propertyGroupMap[id];
                if (group) {
                    deleteGroupAndChildren(group);
                }
            });

            // remove group and any update values
            delete propertyGroupMap[propertyGroup.id];
            delete updatedGroups[propertyGroup.id];
            if (createdGroups[propertyGroup.id]) {
                delete createdGroups[propertyGroup.id];
            } else {
                deletedGroups[propertyGroup.id] = propertyGroup;
            }
        };

        deleteGroupAndChildren(group);
    }
};

export const reorderGroup = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    const {
        propertyGroupMap,
        propertyMap,
        updatedGroups,
        updatedProperties,
        propertyGroupMapInitial,
        propertyMapInitial,
    } = propertyManager;
    const sourceGroup = propertyGroupMap[source.parentId];
    const destinationGroup = propertyGroupMap[destination?.parentId ?? "1"];
    if (!sourceGroup || !destinationGroup) {
        showError("Couldn't move item");
        return;
    }
    const itemId = sourceGroup.children[source.index];

    // remove from source
    sourceGroup.children.splice(source.index, 1);
    // add to destination
    destinationGroup.children.splice(destination?.index ?? 0, 0, itemId);

    if (destinationGroup.id !== sourceGroup.id) {
        // if moved item is a group
        if (propertyGroupMap[itemId]) {
            const updatedGroup = {
                ...propertyGroupMap[itemId],
                parent: `${destinationGroup.id}`,
            };

            updateGroup({ groupId: `${itemId}`, newConfig: updatedGroup });
        }

        // if moved item is a property
        if (propertyMap[itemId]) {
            const updatedProperty = {
                ...propertyMap[itemId],
                parent: `${destinationGroup.id}`,
            };
            updateProperty({ propertyId: `${itemId}`, newConfig: updatedProperty as Property });
        }

        updatedGroups[sourceGroup.id] = sourceGroup;
    }

    updatedGroups[destinationGroup.id] = destinationGroup;
};

export const updateGroupDetails = ({
    groupId,
    name,
    repeatable,
}: {
    groupId: string;
    name?: string;
    repeatable?: boolean;
}) => {
    const { propertyGroupMap, updatedGroups, propertyGroupMapInitial } = propertyManager;
    const group = propertyGroupMap[groupId];
    if (!group) {
        showError("Couldn't update group");
        return;
    }

    const updatedGroup = {
        ...propertyGroupMap[groupId],
        ...(name && { name }),
        ...(repeatable !== undefined && { repeatable }),
    };

    updateGroup({ groupId, newConfig: updatedGroup });
};

export const onCollapse = (groupId: ItemId) => {
    const { collapsed } = propertyManager;
    collapsed[groupId] = true;
};

export const onExpand = (groupId: ItemId) => {
    const { collapsed } = propertyManager;
    collapsed[groupId] = false;
};

//Todo ensure form resets
