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
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSnapshot } from "valtio";
import { PropertyCreate } from "../property-create";
import { GroupCreate } from "../property-group/group-create";
import { ListRenderItem } from "../property-list/list-renderItem";

export interface PropertyManagerProps {
    properties: Property[];
    propertyGroups: PropertyGroup[];
}

export const PropertyManager = ({ properties, propertyGroups = [] }: PropertyManagerProps) => {
    const { changed, tree } = useSnapshot(propertyManager);
    const router = useRouter();

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

    // prompt the user if they try and leave with unsaved changes
    useEffect(() => {
        const warningText = "You have unsaved changes - are you sure you wish to leave this page?";
        const handleWindowClose = (e: BeforeUnloadEvent) => {
            if (!changed) return;
            e.preventDefault();
            return (e.returnValue = warningText);
        };
        const handleBrowseAway = () => {
            if (!changed) return;
            if (window.confirm(warningText)) return;
            router.events.emit("routeChangeError");
            throw "routeChange aborted.";
        };
        window.addEventListener("beforeunload", handleWindowClose);
        router.events.on("routeChangeStart", handleBrowseAway);
        return () => {
            window.removeEventListener("beforeunload", handleWindowClose);
            router.events.off("routeChangeStart", handleBrowseAway);
        };
    }, [changed, router.events]);

    return (
        <Stack sx={{ height: "80vh", width: "100%", overflow: "auto" }} align="stretch">
            <Tree
                tree={tree}
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
