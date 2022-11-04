import { useUncontrolled } from '@mantine/hooks'
import React from 'react'
import { Group } from '@mantine/core'
import structuredClone from '@ungap/structured-clone'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'
import { useStyles } from './styles'
import { TitleInputElement } from '@components/ui/title/title-input/titleInput-element/titleInputElement'

export interface TitleBuilderProps {
    value?: TitleElementProps[]
    onChange?: (elements: TitleElementProps[]) => void
    defaultValue?: TitleElementProps[]
}

export const TitleInput = ({
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

    const updateItem = (index: number, value: string | number) => {
        const clone = structuredClone(_value)
        clone.splice(index, 1, { ..._value[index], value })
        handleChange(clone)
    }

    return (
        <Group spacing={0} p={0} noWrap>
            {_value.map((element, i) => (
                <>
                    <TitleInputElement
                        element={element}
                        key={`${i}${element.type}`}
                        updateItem={(value) => updateItem(i, value)}
                    />
                </>
            ))}
        </Group>
    )
}

TitleInput.displayName = 'TitleInput'
