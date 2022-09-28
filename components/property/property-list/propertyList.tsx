import Tree, { ItemId, TreeDestinationPosition, TreeSourcePosition } from "@atlaskit/tree";
import { Property, PropertyGroup } from "@lib/field/data/field.model";
import { useSetState } from "@mantine/hooks";
import { ListRenderItem } from "./list-renderItem";
import { useStyles } from "./styles";
import { transformToTree } from "./utils/dataTransform";

export interface PropertyListProps {
    propertyGroups: PropertyGroup[] | Record<string, PropertyGroup>;
    properties: Property[] | Record<string, Property>;
}

/** to set initial collased state for groups in tree */
const isCollapsedReducer = (propertyGroups: PropertyListProps["propertyGroups"]) => {
    if (Array.isArray(propertyGroups)) {
        return propertyGroups.reduce<Record<string, boolean>>((acc, group) => {
            acc[group.id] = false;
            return acc;
        }, {});
    }
    return Object.keys(propertyGroups).reduce<Record<string, boolean>>((acc, id) => {
        acc[id] = false;
        return acc;
    }, {});
};

const destinationMatchesOrigin = ({
    source,
    destination,
}: {
    source: TreeSourcePosition;
    destination?: TreeDestinationPosition;
}) => {
    return (
        !destination ||
        (source.index === destination?.index && source.parentId === destination?.parentId)
    );
};

/** List uses @atlaskit/tree */
export const PropertyList = ({ propertyGroups, properties }: PropertyListProps) => {
    const { classes } = useStyles();
    const [collapsed, setState] = useSetState(isCollapsedReducer(propertyGroups));
    const tree = transformToTree({ properties, propertyGroups, collapsed });

    const onExpand = async (itemId: ItemId) => {
        setState({ [itemId]: false });
    };
    const onCollapse = async (itemId: ItemId) => {
        setState({ [itemId]: true });
    };

    return (
        <Tree
            tree={tree}
            renderItem={ListRenderItem}
            onExpand={onExpand}
            onCollapse={onCollapse}
            isDragEnabled={false}
            isNestingEnabled={false}
            //offsetPerLevel={20}
        />
    );
};
