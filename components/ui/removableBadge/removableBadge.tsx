import { ActionIcon, Badge, BadgeProps } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-regular-svg-icons'
import React from 'react'

export const RemovableBadge = ({
    onRemove,
    label,
    ...rest
}: Omit<BadgeProps, 'rightSection'> & {
    onRemove: () => void
    label: string
}) => (
    <Badge
        {...rest}
        pr={0}
        rightSection={
            <ActionIcon onClick={() => onRemove()} ml="sm" variant="light">
                <FontAwesomeIcon icon={faTimes} size="xs" />
            </ActionIcon>
        }
    >
        {label}
    </Badge>
)
