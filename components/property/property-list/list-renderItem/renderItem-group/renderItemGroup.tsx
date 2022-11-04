import { ItemId, RenderItemParams, TreeItem } from '@atlaskit/tree'
import { GroupActions } from '@components/property/property-group/group-actions'
import {
    faChevronDown,
    faChevronRight,
    faGripVertical,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    ActionIcon,
    Box,
    Card,
    Checkbox,
    Group,
    Text,
    TextInput,
} from '@mantine/core'
import { propertyManager, updateGroupDetails } from '@state/propertyManager'
import { useSnapshot } from 'valtio'
import { useStyles } from './styles'
import { PropertyListRenderItemProps } from '@components/property/property-list/list-renderItem'

const getIcon = (
    item: TreeItem,
    onExpand: (itemId: ItemId) => void,
    onCollapse: (itemId: ItemId) => void
) => {
    return item.isExpanded ? (
        <ActionIcon
            onClick={() => onCollapse(item.id)}
            variant="filled"
            color="dark"
        >
            <FontAwesomeIcon icon={faChevronDown} />
        </ActionIcon>
    ) : (
        <ActionIcon
            onClick={() => onExpand(item.id)}
            variant="filled"
            color="grape"
        >
            <FontAwesomeIcon icon={faChevronRight} />
        </ActionIcon>
    )
}

export const RenderItemGroup = ({
    item,
    onExpand,
    onCollapse,
    provided,
    snapshot,
    isEditable,
    isDraggable,
}: PropertyListRenderItemProps) => {
    const { classes } = useStyles()
    return (
        <Box pb="xs">
            <Card
                p="md"
                shadow={snapshot.isDragging ? 'lg' : 'sm'}
                style={{ flex: 1 }}
                radius={0}
                className={classes.groupCard}
            >
                <Group position="apart">
                    <Group>
                        <Group>
                            {isDraggable && (
                                <div {...provided.dragHandleProps}>
                                    <FontAwesomeIcon icon={faGripVertical} />
                                </div>
                            )}
                            {getIcon(item, onExpand, onCollapse)}
                        </Group>
                        <Text>{item.data ? item.data.name : ''}</Text>
                    </Group>
                    {isEditable && (
                        <Group>
                            <Checkbox
                                styles={{ input: { cursor: 'pointer' } }}
                                label="repeatable"
                                checked={item.data.repeatable}
                                onChange={(event) =>
                                    updateGroupDetails({
                                        groupId: `${item.id}`,
                                        repeatable: event.currentTarget.checked,
                                    })
                                }
                            />
                            <GroupActions group={item} />
                        </Group>
                    )}
                </Group>
            </Card>
        </Box>
    )
}
