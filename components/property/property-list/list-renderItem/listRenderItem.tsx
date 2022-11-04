import { RenderItemParams } from '@atlaskit/tree'
import { Group } from '@mantine/core'
import React from 'react'
import { RenderItemProperty } from './renderItem-property'
import { RenderItemPlaceholder } from './renderItem-placeholder'
import { RenderItemGroup } from './renderItem-group'

export type PropertyListRenderItemProps = RenderItemParams & {
    isEditable?: boolean
    isDraggable?: boolean
}

export const ListRenderItem = (props: PropertyListRenderItemProps) => {
    const { item, provided, isEditable = true, isDraggable = true } = props
    return (
        <div ref={provided.innerRef} {...provided.draggableProps}>
            {item.hasChildren ? (
                <RenderItemGroup
                    {...props}
                    isEditable={isEditable}
                    isDraggable={isDraggable}
                />
            ) : item.data.isPlaceholder ? (
                <RenderItemPlaceholder {...props} />
            ) : (
                <RenderItemProperty
                    {...props}
                    isEditable={isEditable}
                    isDraggable={isDraggable}
                />
            )}
        </div>
    )
}
