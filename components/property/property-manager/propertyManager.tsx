import { faker } from "@faker-js/faker";
import { Property, PropertyGroup } from "@lib/field/data/field.model";
import { Button, Stack } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import {
    createGroup,
    createProperty,
    onCollapse,
    onExpand,
    propertyManager,
    reorderGroup,
} from "@state/propertyManager";
import React, { useEffect } from "react";
import { objArrayToHashmap } from "utils/arrayModify";
import { useSnapshot } from "valtio";
import { PropertyList } from "../property-list";
import Tree, { ItemId, TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { ListRenderItem } from "../property-list/list-renderItem";
import { GroupCreate } from "../property-group/group-create";
import { PropertyCreate } from "../property-create";

interface PropertyManagerProps {
    properties: Property[];
    propertyGroups: PropertyGroup[];
}

export const PropertyManager = ({ properties, propertyGroups }: PropertyManagerProps) => {
    useEffect(() => {
        propertyManager.propertyMap = objArrayToHashmap(properties, "id");
        propertyManager.propertyGroupMap = objArrayToHashmap(propertyGroups, "id");
        // set initial state of all groups to open
        propertyManager.collapsed = propertyGroups.reduce<Record<string, boolean>>((acc, group) => {
            acc[group.id] = false;
            return acc;
        }, {});
        propertyManager.editing = true;
    }, [properties, propertyGroups]);
    const snap = useSnapshot(propertyManager);
    console.log("snap", snap);
    return (
        <Stack>
            {/* <PropertyList
                properties={properties}
                propertyGroups={propertyGroups}
                onMove={console.log}
            /> */}
            <Tree
                tree={snap.tree}
                renderItem={ListRenderItem}
                onExpand={onExpand}
                onCollapse={onCollapse}
                onDragEnd={reorderGroup}
                onDragStart={onCollapse}
                isDragEnabled
                isNestingEnabled={false}
                //offsetPerLevel={20}
            />
            <Button.Group>
                <GroupCreate parentId="1" onCreate={createGroup} />
                <PropertyCreate onCreate={createProperty} isModal />
            </Button.Group>
        </Stack>
    );
};
