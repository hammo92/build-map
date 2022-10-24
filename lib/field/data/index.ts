import { WithUser } from '@lib/types/types'
import camelcaseKeys from 'camelcase-keys'
import { zip } from 'radash'
import { indexBy } from 'serverless-cloud-data-utils'
import { CleanedCamel } from 'type-helpers'
import { Required } from 'utility-types'
import { errorIfUndefined } from '../../../lib/utils'
import {
    Field,
    FieldCollection,
    FieldId,
    FieldType,
    Property,
} from './field.model'

export function fieldFromTemplateProperty<T extends FieldType>({
    property,
    type,
    userId,
    overrides,
    parent,
}: {
    property: Property<T>
    type: T
    userId: string
    date: string
    overrides?: Partial<CleanedCamel<Field>>
    parent: string
}): Field<T> {
    const {
        id,
        createdBy,
        createdTime,
        lastEditedBy,
        lastEditedTime,
        active,
        archived,
        ...rest
    } = property

    const newField = new Field<T>({
        ...rest,
        type,
        ...(property.defaultValue && {
            value: property?.defaultValue,
            defaultValue: property.defaultValue,
        }),
        templatePropertyId: property.id,
        parent,
        userId,
        ...overrides,
    })
    return newField
}

//* Create Field //

export interface CreateFieldProps {
    config: Required<Partial<CleanedCamel<Field>>, 'name' | 'type'>
}

export async function createField({
    config,
    userId,
}: WithUser<CreateFieldProps>) {
    const newField = new Field({
        ...config,
        userId,
    })
    await newField.save()
    return newField
}

//* Get Field //

export interface GetFieldProps {
    fieldId: string
}

export async function getField({ fieldId, userId }: WithUser<GetFieldProps>) {
    errorIfUndefined({ fieldId })
    const [field] = await indexBy(FieldId).exact(fieldId).get(Field)
    return field
}

//* Get Field Collection//
export interface GetFieldCollectionProps {
    collectionId: string
}

export async function getFieldCollection({
    collectionId,
    userId,
}: WithUser<GetFieldCollectionProps>) {
    errorIfUndefined({ collectionId })
    const fields = await indexBy(FieldCollection(collectionId)).get(Field)
    return fields
}

//* Delete Field //

export interface DeleteFieldProps {
    fieldId: string
}

export async function deleteField({
    fieldId,
    userId,
}: WithUser<DeleteFieldProps>) {
    errorIfUndefined({ fieldId })
    const [field] = await indexBy(FieldId).exact(fieldId).get(Field)
    await field.delete()
    return field
}

//* Delete Field Collection //

export interface DeleteFieldCollectionProps {
    collectionId: string
}

export async function deleteFieldCollection({
    collectionId,
}: WithUser<DeleteFieldCollectionProps>) {
    /** collection is a shared parent of fields */
    errorIfUndefined({ collectionId })
    const fields = await indexBy(FieldCollection(collectionId)).get(Field)
    await Promise.all(fields.map((field) => field.delete()))
}

//* Update Field //
export interface UpdateFieldProps {
    fieldId: string
    config: Partial<Field>
}

export async function updateField({
    fieldId,
    config,
    userId,
}: WithUser<UpdateFieldProps>) {
    errorIfUndefined({ userId, fieldId })

    // no updates to make
    if (!Object.keys(config).length) throw new Error('No updates provided')

    let field = await getField({ fieldId, userId })
    if (!field) throw new Error('Field not found')

    const { id, ...rest } = config

    // zip infers type from both params, one is partial so returned item is partial
    // override as we know complete field is returned
    const updated = zip(field, rest) as Field

    await updated.save()

    return updated
}

//* Duplicate Field //

export interface DuplicateFieldProps {
    fieldId: string
    keepValue?: boolean
    shouldSave?: boolean
}

export async function duplicateField({
    fieldId,
    userId,
    keepValue,
    shouldSave,
}: WithUser<DuplicateFieldProps>) {
    const field = await getField({ fieldId, userId })
    const {
        id,
        createdTime,
        createdBy,
        lastEditedBy,
        lastEditedTime,
        ...rest
    } = camelcaseKeys(field.clean(), { deep: true })
    const copy = new Field({ ...rest, userId })
    if (copy.defaultValue && (!keepValue || !copy.value)) {
        copy.value = copy.defaultValue
    }
    if (!keepValue && !copy.defaultValue) {
        delete copy.value
    }
    if (shouldSave) {
        await copy.save()
    }
    return copy
}
