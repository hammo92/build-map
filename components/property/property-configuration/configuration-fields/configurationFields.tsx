import { FIELD_TYPES } from '@components/property/property-type/type-select/options'
import { SmartForm } from '@components/smartForm'
import { FieldType } from '@lib/field/data/field.model'
import { Stack } from '@mantine/core'
import React from 'react'
import { FieldsCheckbox } from './fields-checkbox'
import { FieldsNumber } from './fields-number'
import { FieldsRelation, FieldsRelationOptions } from './fields-relation'
import { FieldsDeadline } from './fields-deadline'
import { FieldsSelect } from './fields-select'
import { FieldsTitle } from '@components/property/property-configuration/configuration-fields/fields-title/fieldsTitle'
import { FieldsComponent } from '@components/property/property-configuration/configuration-fields/fields-component'

export type ConfigurationOptions = FieldsRelationOptions

interface ConfigurationFieldsProps {
    type: FieldType
    options?: ConfigurationOptions
}

const configurationTypeFields = (
    type: FieldType,
    options?: ConfigurationOptions
) => {
    switch (type) {
        case 'checkbox':
            return <FieldsCheckbox />
        case 'multiSelect':
            return <FieldsSelect type="multiSelect" />
        case 'number':
            return <FieldsNumber />
        case 'relation':
            return <FieldsRelation {...options} />
        case 'select':
            return <FieldsSelect type="select" />
        case 'title':
            return <FieldsTitle />
        case 'component':
            return <FieldsComponent />

        default:
            return null
    }
}

export const ConfigurationFields = ({
    type,
    options,
}: ConfigurationFieldsProps) => {
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
            {configurationTypeFields(type, options)}
        </Stack>
    )
}
