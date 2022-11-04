import { RenderItemParams } from '@atlaskit/tree'
import { PropertyItem } from '@components/property/property-item'
import { faGripVertical } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Box } from '@mantine/core'
import { PropertyListRenderItemProps } from '@components/property/property-list/list-renderItem'

export const RenderItemProperty = ({
    item,
    provided,
    isDraggable,
    isEditable,
}: PropertyListRenderItemProps) => {
    return (
        <Box pb="xs">
            <PropertyItem
                property={item.data}
                key={`field-${item.id}`}
                grow
                isEditable={isEditable}
                leftContent={
                    isDraggable && (
                        <div
                            {...provided.dragHandleProps}
                            style={{
                                pointerEvents:
                                    item.id === 'placeholder' && 'none',
                            }}
                        >
                            <FontAwesomeIcon icon={faGripVertical} />
                        </div>
                    )
                }
            />
        </Box>
    )
}
