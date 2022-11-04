import React from 'react'
import { useStyles } from './styles'
import { RemovableBadge } from '@components/ui/removableBadge'
import { splitCamel } from '../../../../../utils/stringTransform'
import { UnstyledInput } from '@components/ui/unstyledInput'
import { ELEMENT_OPTIONS } from '@components/ui/title/title-builder/constants/elements'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'
import { TextInput, Text, NumberInput } from '@mantine/core'

export const TitleInputElement = ({
    element,
    updateItem,
}: {
    element: TitleElementProps
    updateItem: (value: TitleElementProps['value']) => void
}) => {
    if (element.type === 'input' && element.variant === 'text') {
        return (
            <TextInput
                value={element.value}
                onChange={(event) => updateItem(event.currentTarget.value)}
            />
        )
    }
    if (element.type === 'input' && element.variant === 'number') {
        return (
            <NumberInput
                value={element.value}
                onChange={(value) => updateItem(value)}
            />
        )
    }
    if (
        (element.type === 'string' || element.type === 'variable') &&
        element.value
    ) {
        return <TextInput disabled={true} value={element.value} />
    }
    return null
}
