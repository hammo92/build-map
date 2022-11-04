import React from 'react'
import { ListRenderItem } from '@components/property/property-list/list-renderItem'
import { onCollapse, onExpand, reorderGroup } from '@state/propertyManager'
import Tree, { TreeData } from '@atlaskit/tree'

type PropertyTreeProps = Partial<
    Omit<
        Tree['props'],
        'renderItem' | 'isNestingEnabled' | 'onDragStart' | 'isDragEnabled'
    >
> & {
    isEditable: boolean
    isDragEnabled: boolean
}

export const PropertyTree = ({
    tree,
    isEditable,
    onExpand,
    onCollapse,
    isDragEnabled,
    offsetPerLevel = 20,
}: PropertyTreeProps) => {
    return (
        <Tree
            tree={tree}
            renderItem={(params) =>
                ListRenderItem({
                    ...params,
                    isDraggable: isDragEnabled,
                    isEditable: isEditable,
                })
            }
            onExpand={onExpand}
            onCollapse={onCollapse}
            onDragEnd={reorderGroup}
            onDragStart={(itemId) => onCollapse && onCollapse(itemId, [])}
            isDragEnabled={isDragEnabled}
            isNestingEnabled={false}
            offsetPerLevel={offsetPerLevel}
        />
    )
}
