import React from 'react'
import { SmartFormDefaultControllerProps } from '@components/smartForm/smartForm-controller'
import { ActionIcon, Group, Text, Tooltip } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons'

export const ControllerLabel = ({
    label,
    required,

    rightContent,
    description,
}: Pick<
    SmartFormDefaultControllerProps,
    'label' | 'required' | 'description' | 'rightContent'
>) => {
    return (
        <Group position="apart" noWrap>
            <Group>
                <Text lineClamp={1} sx={{ flexGrow: 1 }} size="sm">
                    {label}
                    {label && required && ' *'}
                </Text>
            </Group>
            <Group>
                {description && (
                    <Tooltip label={description}>
                        <ActionIcon sx={{ flexShrink: 0 }} size="sm">
                            <FontAwesomeIcon
                                icon={faQuestionCircle}
                                size="sm"
                            />
                        </ActionIcon>
                    </Tooltip>
                )}
                {rightContent && rightContent}
            </Group>
        </Group>
    )
}
