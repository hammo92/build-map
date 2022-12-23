import { Field } from '@lib/field/data/field.model'
import React from 'react'
import { CleanedCamel } from 'type-helpers'
import { FieldTypeCheckbox } from '../field-fieldType/fieldType-checkbox'
import { FieldTypeDate } from '../field-fieldType/fieldType-date'
import { FieldTypeEmail } from '../field-fieldType/fieldType-email'
import { FieldTypeImage } from '../field-fieldType/fieldType-image'
import { FieldTypeMultiSelect } from '../field-fieldType/fieldType-multiSelect'
import { FieldTypeNumber } from '../field-fieldType/fieldType-number'
import { FieldTypeRelation } from '../field-fieldType/fieldType-relation'
import { FieldTypeRichText } from '../field-fieldType/fieldType-richText'
import { FieldTypeSelect } from '../field-fieldType/fieldType-select'
import { FieldTypeText } from '../field-fieldType/fieldType-text'
import { FieldTypeTitle } from '@components/field/field-fieldType/fieldType-title/fieldTypeTitle'
import { FieldTypeDeadline } from '@components/field/field-fieldType/fieldType-deadline'

export const getFieldElement = ({
    field,
    rightContent,
}: {
    field: CleanedCamel<Field>
    rightContent?: React.ReactElement
}) => {
    switch (field.type) {
        case 'email':
            return (
                <FieldTypeEmail
                    field={field as CleanedCamel<Field<'email'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'date':
            return (
                <FieldTypeDate
                    field={field as CleanedCamel<Field<'date'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'checkbox':
            return (
                <FieldTypeCheckbox
                    field={field as CleanedCamel<Field<'checkbox'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'multiSelect':
            return (
                <FieldTypeMultiSelect
                    field={field as CleanedCamel<Field<'multiSelect'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'number':
            return (
                <FieldTypeNumber
                    field={field as CleanedCamel<Field<'number'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'richText':
            return (
                <FieldTypeRichText
                    field={field as CleanedCamel<Field<'richText'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'select':
            return (
                <FieldTypeSelect
                    field={field as CleanedCamel<Field<'select'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'text':
            return (
                <FieldTypeText
                    field={field as CleanedCamel<Field<'text'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'image':
            return (
                <FieldTypeImage
                    field={field as CleanedCamel<Field<'image'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'relation':
            return (
                <FieldTypeRelation
                    field={field as CleanedCamel<Field<'relation'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'title':
            return (
                <FieldTypeTitle
                    field={field as CleanedCamel<Field<'title'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        case 'deadline':
            return (
                <FieldTypeDeadline
                    field={field as CleanedCamel<Field<'deadline'>>}
                    key={field.id}
                    rightContent={rightContent}
                />
            )
        default:
            return null
    }
}
