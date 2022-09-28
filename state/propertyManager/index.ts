import { ItemId, TreeData, TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { transformToTree } from "@components/property/property-list/utils/dataTransform";
import { FieldTypes, Property, PropertyGroup } from "@lib/field/data/field.model";
import memoize from "proxy-memoize";
import { ulid } from "ulid";
import { proxyWithComputed } from "valtio/utils";
import { showNotification } from "@mantine/notifications";
import { Writable } from "type-fest";
import { Required } from "utility-types";
import { content } from "@lib/content/endpoints";
interface PropertyManagerProps {
    propertyMap: Record<string, Partial<Required<Property, "type" | "parent" | "name">>>;
    propertyGroupMap: Record<string, PropertyGroup>;
    collapsed: Record<string, boolean>;
    editing: boolean;
}

const showError = (message: string) =>
    showNotification({
        title: "Error",
        message,
        color: "red",
    });

export const propertyManager = proxyWithComputed<PropertyManagerProps, { tree: TreeData }>(
    {
        propertyMap: {},
        propertyGroupMap: {},
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
    }
);

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
    const { propertyMap, propertyGroupMap } = propertyManager;
    const parent = propertyGroupMap[parentId];
    const property = {
        type,
        name,
        id: ulid(),
        parent: parentId,
        ...propertyDetails,
    };
    propertyMap[property.id] = property;
    parent.children.push(property.id);
};

export const deleteProperty = (propertyId: string) => {
    const { propertyMap, propertyGroupMap } = propertyManager;
    const property = propertyMap[propertyId];
    if (!property) {
        showError("Couldn't delete property");
        return;
    }

    // remove from parent group
    propertyGroupMap[property.parent ?? "1"].children = propertyGroupMap[
        property.parent ?? "1"
    ].children.filter((id) => id !== propertyId);

    delete propertyMap[propertyId];
};

export const createGroup = ({ name, parentId = "1" }: { name: string; parentId?: string }) => {
    const { propertyGroupMap, collapsed } = propertyManager;
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

    propertyGroupMap[id] = newGroup;
    const parentGroup = propertyGroupMap[parentId];
    parentGroup?.children.push(newGroup.id);
    collapsed[newGroup.id] = false;
};

export const deleteGroup = ({
    groupId,
    deleteContents = false,
}: {
    groupId: string;
    deleteContents?: boolean;
}) => {
    const { propertyGroupMap, propertyMap } = propertyManager;
    const group = propertyGroupMap[groupId];
    if (!group) {
        showError("Couldn't delete group");
        return;
    }

    // remove group from parent
    const parentGroup = propertyGroupMap[group.parent] ?? "1";
    parentGroup.children = parentGroup.children.filter((id) => id !== groupId);

    // move children into parent if keeping contents
    if (!deleteContents) {
        parentGroup.children.push(...group.children);
        return;
    }

    // recursively delete children
    const deleteChildren = (propertyGroup: PropertyGroup) => {
        propertyGroup.children.forEach((id) => {
            const property = propertyMap[id];
            if (property) {
                delete propertyMap[id];
                return;
            }
            const childGroup = propertyGroupMap[id];
            deleteChildren(childGroup);
            delete propertyGroupMap[id];
        });
    };
};

export const reorderGroup = (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
    const { propertyGroupMap } = propertyManager;
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
};

export const updateGroup = ({
    groupId,
    name,
    repeatable,
}: {
    groupId: string;
    name?: string;
    repeatable?: boolean;
}) => {
    const { propertyGroupMap } = propertyManager;
    const group = propertyGroupMap[groupId];
    if (!group) {
        showError("Couldn't update group");
        return;
    }
    propertyGroupMap[groupId] = {
        ...propertyGroupMap[groupId],
        ...(name && { name }),
        ...(repeatable !== undefined && { repeatable }),
    };
};

export const onCollapse = (groupId: ItemId) => {
    const { collapsed } = propertyManager;
    collapsed[groupId] = true;
};

export const onExpand = (groupId: ItemId) => {
    const { collapsed } = propertyManager;
    collapsed[groupId] = false;
};
