import { useUncontrolled } from '@mantine/hooks'
import React, { forwardRef } from 'react'
import { ActionIcon, Box, Group, Menu, Stack } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { ControllerLabel } from '@components/smartForm/smartForm-controller/controller-label'
import structuredClone from '@ungap/structured-clone'
import { splitCamel } from '../../../../utils/stringTransform'
import {
    TitleBuilderElement,
    TitleElementProps,
} from '@components/ui/title/title-builder/titleBuilder-element'
import { ELEMENTS } from '@components/ui/title/title-builder/constants/elements'
import { TitleBuilderPreview } from '@components/ui/title/title-builder/titleBuilder-preview'
import { useStyles } from './styles'

export interface TitleBuilderProps {
    value?: TitleElementProps[]
    onChange?: (elements: TitleElementProps[]) => void
    defaultValue?: TitleElementProps[]
}

export const TitleBuilder = ({
    value,
    onChange,
    defaultValue,
}: TitleBuilderProps) => {
    const { classes } = useStyles()
    const [_value, handleChange] = useUncontrolled({
        value: Array.isArray(value) ? value : undefined,
        defaultValue,
        finalValue: [
            {
                type: 'string',
                value: '',
            },
        ],
        onChange,
    })
    console.log('👉 _value >>', _value)

    const addItem = (props: TitleElementProps) => {
        // add item with a text input field
        handleChange([
            ..._value,
            props,
            {
                type: 'string',
                value: '',
            },
        ])
    }

    /** Remove item and merge surrounding strings **/
    const removeItem = (index: number) => {
        const nextItem = _value[index + 1]
        const prevItem = index > 0 ? _value[index - 1] : undefined

        // remove item and merge surrounding strings
        if (nextItem.type === 'string' && prevItem?.type === 'string') {
            const clone = structuredClone(_value)
            clone.splice(index - 1, 3, {
                ...prevItem,
                value: (prevItem?.value ?? '').concat(nextItem.value ?? ''),
            })
            handleChange(clone)
        }
    }

    const updateItem = (index: number, updatedValue: TitleElementProps) => {
        const clone = structuredClone(_value)
        clone.splice(index, 1, updatedValue)
        handleChange(clone)
    }

    const menu = (
        <Menu position="left-start">
            <Menu.Target>
                <ActionIcon size={'sm'}>
                    <FontAwesomeIcon icon={faPlus} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {ELEMENTS.map(({ title, type, options }) => (
                    <>
                        <Menu.Label>{title}</Menu.Label>
                        {options.map((variant) => (
                            <Menu.Item
                                key={variant}
                                sx={{ textTransform: 'capitalize' }}
                                onClick={() =>
                                    addItem({
                                        type,
                                        variant: variant,
                                    })
                                }
                            >
                                {splitCamel(variant!)}
                            </Menu.Item>
                        ))}
                    </>
                ))}
            </Menu.Dropdown>
        </Menu>
    )

    return (
        <Stack spacing={0}>
            <Box className={classes.container}>
                <Group spacing={0} p={'sm'} noWrap>
                    {_value.map((element, i) => (
                        <>
                            <TitleBuilderElement
                                element={element}
                                key={`${i}${element.type}`}
                                isLast={i === _value.length - 1}
                                removeItem={() => removeItem(i)}
                                updateItem={(item) => updateItem(i, item)}
                            />
                        </>
                    ))}
                    {menu}
                </Group>
            </Box>

            <TitleBuilderPreview fields={_value} />
        </Stack>
    )
}

TitleBuilder.displayName = 'TitleBuilder'
