import { ItemId, RenderItemParams, TreeItem } from "@atlaskit/tree";
import { GroupActions } from "@components/contentTemplate/contentTemplate-group/group-actions";
import { useUpdatePropertyGroup } from "@data/contentTemplate/hooks";
import { faChevronDown, faChevronRight, faGripVertical } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Checkbox, Group, Text, TextInput } from "@mantine/core";
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
    const { mutateAsync } = useUpdatePropertyGroup();
    console.log("item", item);
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
                    <Text>{item.data ? item.data.name : ""}</Text>
                </Group>
                <Group>
                    <Checkbox
                        style={{ cursor: "pointer" }}
                        label="repeatable"
                        defaultChecked={item.data.repeatable}
                        onChange={(event) =>
                            mutateAsync({
                                contentTemplateId: item.data.templateId,
                                propertyGroupId: `${item.id}`,
                                repeatable: event.currentTarget.checked,
                            })
                        }
                    />
                    <GroupActions group={item} />
                </Group>
            </Group>
        </Card>
    );
};
