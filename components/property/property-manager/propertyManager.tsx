import Tree from "@atlaskit/tree";
import { Property, PropertyGroup } from "@lib/field/data/field.model";
import { Button, Stack } from "@mantine/core";
import {
    createGroup,
    createProperty,
    initiateState,
    onCollapse,
    onExpand,
    propertyManager,
    reorderGroup,
    resetState,
} from "@state/propertyManager";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { PropertyCreate } from "../property-create";
import { GroupCreate } from "../property-group/group-create";
import { ListRenderItem } from "../property-list/list-renderItem";

export interface PropertyManagerProps {
    properties: Property[];
    propertyGroups: PropertyGroup[];
}

export const PropertyManager = ({ properties, propertyGroups }: PropertyManagerProps) => {
    useEffect(() => {
        // set initial state of all groups to open
        propertyManager.collapsed = propertyGroups.reduce<Record<string, boolean>>((acc, group) => {
            acc[group.id] = false;
            return acc;
        }, {});
    }, []);

    useEffect(() => {
        initiateState({ properties, propertyGroups });
        return () => resetState();
    }, [properties, propertyGroups]);

    const snap = useSnapshot(propertyManager);
    console.log("snap", snap);
    return (
        <Stack sx={{ height: "80vh", width: "100%", overflow: "auto" }} align="stretch">
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
