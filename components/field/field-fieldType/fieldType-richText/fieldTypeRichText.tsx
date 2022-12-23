import { SmartForm } from '@components/smartForm'
import { ContentFieldRichText } from '@lib/content/data/types'
import { PropertyRichText } from '@lib/contentTemplate/data/types'
import React from 'react'
import { FieldProps } from '../../types'

export const FieldTypeRichText = ({
    field,
    ...rest
}: FieldProps<'richText'>) => (
    <SmartForm.RichText
        name={field.id}
        label={field.name}
        defaultValue={field.defaultValue}
        value={field.value}
        {...rest}
    />
)
