import {
    CreateFieldProps,
    DeleteFieldProps,
    GetFieldCollectionProps,
    GetFieldProps,
    UpdateFieldProps,
} from '@lib/field/data'
import { Field } from '@lib/field/data/field.model'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedSnake } from 'type-helpers'

export async function createField({ config }: CreateFieldProps) {
    const { data } = await apiClient.post<{ field: CleanedSnake<Field> }>(
        `/api/proxy/fields`,
        {
            config,
        }
    )
    return camelcaseKeys(data, { deep: true })
}

export async function getField({ fieldId }: GetFieldProps) {
    const { data } = await apiClient.get<{ field: CleanedSnake<Field> }>(
        `/api/proxy/fields/${fieldId}`
    )
    return camelcaseKeys(data, { deep: true })
}

export async function getFieldCollection({
    collectionId,
}: GetFieldCollectionProps) {
    const { data } = await apiClient.get<{ field: CleanedSnake<Field> }>(
        `/api/proxy/fields/collections/${collectionId}`
    )
    return camelcaseKeys(data, { deep: true })
}

export async function updateField({ fieldId, config }: UpdateFieldProps) {
    const { data } = await apiClient.patch<{ field: CleanedSnake<Field> }>(
        `/api/proxy/fields/${fieldId}`,
        {
            config,
        }
    )
    return camelcaseKeys(data, { deep: true })
}

export async function deleteField({ fieldId }: DeleteFieldProps) {
    const { data } = await apiClient.delete<{ field: CleanedSnake<Field> }>(
        `/api/proxy/fields/${fieldId}`
    )
    return camelcaseKeys(data, { deep: true })
}
