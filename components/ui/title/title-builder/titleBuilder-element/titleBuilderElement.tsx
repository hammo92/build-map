import React from 'react'
import { useStyles } from './styles'
import { RemovableBadge } from '@components/ui/removableBadge'
import { splitCamel } from '../../../../../utils/stringTransform'
import { UnstyledInput } from '@components/ui/unstyledInput'
import { ELEMENT_OPTIONS } from '@components/ui/title/title-builder/constants/elements'

export type ElementType = 'input' | 'string' | 'variable'

export type TitleElementProps<T extends ElementType = ElementType> = {
    type: T
    variant?: T extends 'input'
        ? 'text' | 'number'
        : T extends 'variable'
        ? typeof ELEMENT_OPTIONS[number]
        : never
    value?: T extends 'string'
        ? string
        : T extends 'text'
        ? string
        : T extends 'number'
        ? number
        : any
}

export const TitleBuilderElement = ({
    element,
    isLast,
    removeItem,
    updateItem,
}: {
    element: TitleElementProps
    isLast: boolean
    removeItem: () => void
    updateItem: (item: TitleElementProps) => void
}) => {
    if (element.type === 'input') {
        return (
            <RemovableBadge
                radius={'sm'}
                label={splitCamel(element.variant!)}
                onRemove={() => removeItem()}
            />
        )
    }
    if (element.type === 'string') {
        return (
            <UnstyledInput
                width={isLast ? 'full' : 'fit'}
                value={`${element.value}`}
                onChange={(value) => {
                    return updateItem({
                        ...element,
                        value,
                    })
                }}
            />
        )
    }
    if (element.type === 'variable') {
        return (
            <RemovableBadge
                color={'teal'}
                radius={'sm'}
                label={splitCamel(element.variant!)}
                onRemove={() => removeItem()}
            />
        )
    }
    return null
}
