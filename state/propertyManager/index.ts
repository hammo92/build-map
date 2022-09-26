import { TreeData, TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { Property, PropertyGroup } from "@lib/field/data/field.model";
import { is } from "immer/dist/internal";
import { ulid } from "ulid";
import { proxy } from "valtio";

interface PropertyManagerProps {
    properties: Property[];
    propertyGroups: PropertyGroup[];
    tree: TreeData | undefined;
}

export const propertyManager = proxy<PropertyManagerProps>({
    properties: [],
    propertyGroups: [],
    tree: undefined,
});

export const createGroup = ({ name, parentId = "1" }: { name: string; parentId: string }) => {
    const { properties, propertyGroups } = propertyManager;
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

    propertyGroups.push(newGroup);
    const parentGroup = propertyGroups.find(({ id }) => id === parentId);
    parentGroup?.children.push(newGroup.id);
};

export const reorderGroup = ({
    source,
    destination,
}: {
    source: TreeSourcePosition;
    destination: TreeDestinationPosition;
}) => {
    const { properties, propertyGroups } = propertyManager;
    let sourceGroup: PropertyGroup | undefined;
    let destinationGroup: PropertyGroup | undefined;

    for (let i = 0; i < propertyGroups.length; i++) {
        if (sourceGroup && destinationGroup) break;
        const { id } = propertyGroups[i];
        if (id === source.parentId) {
            sourceGroup = propertyGroups[i];
        }
        if (id === destination.parentId) {
            destinationGroup = propertyGroups[i];
        }
    }
};
