import { RenderItemParams } from '@atlaskit/tree'
import { Box, Group, Text } from '@mantine/core'
import React from 'react'
import { CreateButtonGroup } from '@components/property/property-create/createButtonGroup'

export const RenderItemPlaceholder = ({ item, provided }: RenderItemParams) => {
    return (
        <Box pb="xs">
            <div {...provided.dragHandleProps}></div>
            <CreateButtonGroup parentId={`${item.data.parent}`} />
        </Box>
    )
}
