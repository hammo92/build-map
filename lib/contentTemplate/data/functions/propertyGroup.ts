import { TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";
import { objArrToKeyIndexedMap } from "../../../../utils/arrayModify";
import { ContentTemplate, PropertyGroup } from "../contentTemplate.model";
import { Property } from "../types";

interface CreateGroupProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
    parentId?: string;
    name: string;
}

export const createGroup = ({ contentTemplate, name, parentId = "1" }: CreateGroupProps) => {
    const id = ulid();
    const newItem = {
        id,
        children: [],
        hasChildren: true,
        repeatable: false,
        name,
        type: "propertyGroup",
    } as PropertyGroup;

    const updatedGroups = [...contentTemplate.propertyGroups, newItem];
    const parentIndex = updatedGroups.findIndex(({ id }) => id === parentId);
    if (parentIndex === undefined) throw new Error("couldn't find parent");

    (updatedGroups[parentIndex] as PropertyGroup).children.push(id);

    return { updatedGroups, parent: updatedGroups[parentIndex] };
};

interface ReorderGroupsProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
    source: TreeSourcePosition;
    destination: TreeDestinationPosition;
}

export const reorderGroups = ({ contentTemplate, source, destination }: ReorderGroupsProps) => {
    const propertyGroupMap = objArrToKeyIndexedMap(contentTemplate.propertyGroups, "id");

    const moveItemSourceGroup = propertyGroupMap.get(source.parentId);
    const moveItemDestinationGroup = propertyGroupMap.get(destination.parentId);
    if (!moveItemDestinationGroup || !moveItemSourceGroup)
        throw new Error("No valid source, or destination");

    const moveItemId = moveItemSourceGroup.children[source.index];
    let moveItem =
        propertyGroupMap.get(moveItemId) ??
        contentTemplate.fields.find(({ id }) => id === moveItemId);

    if (!moveItemId || !moveItem) throw new Error("Can't find item");

    // remove item from initial position
    moveItemSourceGroup?.children.splice(source.index, 1);
    //move to new position
    moveItemDestinationGroup?.children.splice(destination.index ?? 0, 0, moveItemId!);

    return {
        updatedGroups: Array.from(propertyGroupMap, ([_, value]) => value),
        item: moveItem,
        source: { group: moveItemSourceGroup, index: source.index },
        destination: { group: moveItemDestinationGroup, index: destination.index },
    };
};

interface DeletePropertyGroupProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
    groupId: string;
    deleteContents?: boolean;
}

export const findParentGroup = ({
    propertyGroups,
    itemId,
}: {
    propertyGroups: PropertyGroup[];
    itemId: string;
}) => {
    // find parent group
    const parentGroup = propertyGroups.find(({ children }) => children.includes(itemId));
    if (!parentGroup) throw new Error("Parent group not found");
    return parentGroup;
};

export const deleteGroup = ({
    contentTemplate,
    groupId,
    deleteContents,
}: DeletePropertyGroupProps) => {
    if (!contentTemplate) throw new Error("No content template found");

    const propertyMap = objArrToKeyIndexedMap(contentTemplate.propertyGroups, "id");

    const propertyGroup = propertyMap.get(groupId);
    if (!propertyGroup) throw new Error("Group not found");

    //init arrays for history
    const removedGroups: PropertyGroup[] = [];
    const removedFields: Property[] = [];

    // find parent group
    const parentGroup = findParentGroup({
        propertyGroups: contentTemplate.propertyGroups,
        itemId: groupId,
    });

    // find group index in parent's children array and remove it
    const groupIndex = parentGroup.children.indexOf(groupId);
    parentGroup.children.splice(groupIndex, 1);

    if (!deleteContents) {
        // move group children into parent
        parentGroup.children.push(...propertyGroup.children);
    }

    let fields = [...contentTemplate.fields];

    if (deleteContents) {
        const fieldsMap = objArrToKeyIndexedMap(contentTemplate.fields, "id");
        const deleteChildren = (propertyGroup: PropertyGroup) => {
            propertyGroup.children.forEach((id) => {
                /** Check if id belongs to a field, if true remove field */
                const field = fieldsMap.get(`${id}`);
                if (field) {
                    fieldsMap.delete(`${id}`);
                    removedFields.push(field);
                } else {
                    const childGroup = propertyMap.get(id);
                    if (childGroup) {
                        deleteChildren(childGroup);
                        removedGroups.push(childGroup);
                    }
                    propertyMap.delete(id);
                }
            });
        };
        deleteChildren(propertyGroup);
        fields = Array.from(fieldsMap, ([_, value]) => ({ ...value }));
    }

    return {
        targetGroup: propertyGroup,
        removedFields,
        removedGroups,
        fields,
        propertyGroups: Array.from(propertyMap, ([_, value]) => ({ ...value })),
    };
};

interface UpdateGroupProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
    groupId: string;
    name?: string;
    repeatable?: boolean;
}

export const updateGroup = ({ contentTemplate, groupId, repeatable, name }: UpdateGroupProps) => {
    const index = contentTemplate.propertyGroups.findIndex(({ id }) => id === groupId);
    const group = contentTemplate.propertyGroups[index];
    const updatedGroup = {
        ...group,
        ...(name && { name }),
        ...(repeatable !== undefined && { repeatable }),
    };

    return { updatedGroup, index };
};
