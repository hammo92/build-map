import Tree, {
    ItemId,
    moveItemOnTree,
    TreeData,
    TreeDestinationPosition,
    TreeSourcePosition,
} from "@atlaskit/tree";
import { useReorderPropertyGroups } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Skeleton, Stack } from "@mantine/core";
import { useSetState } from "@mantine/hooks";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { GroupCreate } from "../contentTemplate-group/group-create";
import { transformTemplateToTree, transformTreeGroupsToModel } from "../utils/dataTransforms";
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
    const [collapsed, setState] = useSetState(
        contentTemplate.propertyGroups.reduce<Record<string, boolean>>((acc, group) => {
            acc[group.id] = false;
            return acc;
        }, {})
    );
    const tree = transformTemplateToTree(contentTemplate, collapsed);

    const { classes } = useStyles();

    const { mutateAsync } = useReorderPropertyGroups();

    async function onMove(source: TreeSourcePosition, destination: TreeDestinationPosition) {
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            source,
            destination,
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
        setState({ [itemId]: false });
    };

    const onCollapse = async (itemId: ItemId) => {
        setState({ [itemId]: true });
    };

    const onDragEnd = async (source: TreeSourcePosition, destination?: TreeDestinationPosition) => {
        if (!destination) {
            return;
        }
        await onMove(source, destination);
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
                <GroupCreate contentTemplateId={contentTemplate.id} />
            </Group>
        </Stack>
    );
};
