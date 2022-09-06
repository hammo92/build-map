import Tree, {
    ItemId,
    moveItemOnTree,
    mutateTree,
    TreeData,
    TreeDestinationPosition,
    TreeSourcePosition,
} from "@atlaskit/tree";
import { useUpdatePropertyGroups } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Skeleton, Stack } from "@mantine/core";
import { FC, useCallback } from "react";
import { CleanedCamel } from "type-helpers";
import { GroupCreate } from "../contentTemplate-group/group-create";
import { transformTemplateToTree, transformTreeGroupsToModel } from "../utils/dataTransforms";
import { onAdd } from "./functions";
import { useStyles } from "./styles";
import { TreeRenderItem } from "./tree-renderItem";

const FieldListSkeleton = () => (
    <Stack spacing="sm">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
    </Stack>
);

export const ContentTemplateTree: FC<{ contentTemplate: CleanedCamel<ContentTemplate> }> = ({
    contentTemplate,
}) => {
    console.log("contentTemplate", contentTemplate);
    const tree = transformTemplateToTree(contentTemplate);
    const { classes } = useStyles();

    const { mutateAsync } = useUpdatePropertyGroups();

    async function onMove(treeData: TreeData) {
        console.log("treeData :>> ", treeData);
        console.log("transformTreeGroupsToModel(treeData)", transformTreeGroupsToModel(treeData));
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            propertyGroups: transformTreeGroupsToModel(treeData),
        });
    }

    function getParent(itemId: string | number): string | null {
        let parent = null;
        Object.values(tree.items).forEach((item) => {
            if (item.hasChildren && item.children.includes(itemId)) {
                parent = item.id;
            }
        });
        return parent;
    }

    // Recursively find parents
    function getNumberOfParents(parent_id: string | number, childNesting = 0): number {
        let parent = getParent(parent_id);

        if (!parent) return childNesting;

        childNesting++;
        return getNumberOfParents(parent, childNesting);
    }

    const onExpand = async (itemId: ItemId) => {
        const mutated = mutateTree(tree, itemId, { isExpanded: true });
        await onMove(mutated);
    };

    const onCollapse = async (itemId: ItemId) => {
        const mutated = mutateTree(tree, itemId, { isExpanded: false });
        await onMove(mutated);
    };

    const onDragEnd = async (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
        if (!destination) {
            return;
        }

        const newTree = moveItemOnTree(tree, source, destination);
        await onMove(newTree);
    };

    return (
        <Stack sx={{ height: "80vh", width: "100%", overflow: "auto" }} align="stretch">
            <Tree
                tree={tree}
                renderItem={TreeRenderItem}
                onExpand={onExpand}
                onCollapse={onCollapse}
                onDragEnd={onDragEnd}
                onDragStart={onCollapse}
                isDragEnabled
                isNestingEnabled={false}
                //offsetPerLevel={20}
            />
            <Group>
                <GroupCreate contentTemplate={contentTemplate} />
            </Group>
        </Stack>
    );
};
