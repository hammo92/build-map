import { ItemId, RenderItemParams, TreeItem } from "@atlaskit/tree";
import { GroupDelete } from "@components/contentTemplate/contentTemplate-group/group-delete";
import { faChevronDown, faChevronRight, faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, TextInput } from "@mantine/core";
import React from "react";
import { useStyles } from "./styles";

const getIcon = (
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void
) => {
    return item.isExpanded ? (
        <ActionIcon onClick={() => onCollapse(item.id)} variant="filled">
            <FontAwesomeIcon icon={faChevronDown} />
        </ActionIcon>
    ) : (
        <ActionIcon onClick={() => onExpand(item.id)} variant="filled">
            <FontAwesomeIcon icon={faChevronRight} />
        </ActionIcon>
    );
};

export const RenderItemGroup = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
}: RenderItemParams) => {
    const { classes } = useStyles();
    return (
        <Card
            p="md"
            shadow={snapshot.isDragging ? "lg" : "sm"}
            style={{ flex: 1 }}
            withBorder
            radius={0}
            className={classes.groupCard}
        >
            <Group position="apart">
                <Group>
                    <Group>
                        <div {...provided.dragHandleProps}>
                            <FontAwesomeIcon icon={faGripVertical} />
                        </div>
                        {getIcon(item, onExpand, onCollapse)}
                    </Group>
                    <TextInput defaultValue={item.data ? item.data.title : ""} />
                </Group>
                <GroupDelete group={item} />
            </Group>
        </Card>
    );
};
