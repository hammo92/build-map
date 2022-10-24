import { FIELD_TYPES } from '@components/property/property-type/type-select/options'
import { SmartForm } from '@components/smartForm'
import { FieldType } from '@lib/field/data/field.model'
import { Stack } from '@mantine/core'
import React from 'react'
import { FieldsCheckbox } from './fields-checkbox'
import { FieldsNumber } from './fields-number'
import { FieldsRelation } from './fields-relation'
import { FieldsSelect } from './fields-select'
import { FieldsTitle } from '@components/property/property-configuration/configuration-fields/fields-title/fieldsTitle'

interface ConfigurationFieldsProps {
    type: FieldType
}

const configurationTypeFields = (type: FieldType) => {
    switch (type) {
        case 'checkbox':
            return <FieldsCheckbox />
        case 'multiSelect':
            return <FieldsSelect type="multiSelect" />
        case 'number':
            return <FieldsNumber />
        case 'relation':
            return <FieldsRelation />
        case 'select':
            return <FieldsSelect type="select" />
        case 'title':
            return <FieldsTitle />
        default:
            return null
    }
}

export const ConfigurationFields = ({ type }: ConfigurationFieldsProps) => {
    const variants = FIELD_TYPES[type]?.variants
    return (
        <Stack spacing="sm">
            <SmartForm.FieldGroup cols={variants?.length ? 2 : 1}>
                <SmartForm.TextInput
                    name="name"
                    required
                    label="Property Name"
                    rules={{ minLength: 2 }}
                />
                {variants?.length ? (
                    <SmartForm.Select
                        required
                        label="Variant"
                        name="variant"
                        data={variants?.map((variant) => ({
                            ...variant,
                            value: variant.type,
                        }))}
                        //disabled={options?.variantLocked}
                    />
                ) : null}
            </SmartForm.FieldGroup>
            {configurationTypeFields(type)}
        </Stack>
    )
}
