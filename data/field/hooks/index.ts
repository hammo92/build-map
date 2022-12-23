import { GetFieldCollectionProps, GetFieldProps } from '@lib/field/data'
import { showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { Field } from 'react-hook-form'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CleanedCamel } from 'type-helpers'
import { ulid } from 'ulid'
import { Keys } from '../constants'
import {
    createField,
    deleteField,
    getField,
    getFieldCollection,
    updateField,
} from '../queries'

export function useCreateField() {
    const queryClient = useQueryClient()

    return useMutation(createField, {
        mutationKey: Keys.CREATE_FIELD,
        onMutate: async ({ config }) => {
            const queryId = [Keys.GET_FIELD_COLLECTION, config.parent]

            // Cancel any outgoing re-fetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                fields: CleanedCamel<Field>[]
            }>(queryId)

            if (currentData?.fields) {
                const { fields } = currentData

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => ({
                    fields: [...fields, { ...config, id: ulid() }],
                }))
            }
        },
        onSettled: async (data) => {
            await queryClient.invalidateQueries([
                Keys.GET_FIELD_COLLECTION,
                data?.field?.parent,
            ])
        },
        onError: (error: AxiosError<{ message: string }>) => {
            showNotification({
                title: 'Could not create field',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
    })
}

export function useGetField(props: GetFieldProps) {
    return useQuery([Keys.GET_FIELD, props.fieldId], () => getField(props))
}

export function useGetFieldCollection(props: GetFieldCollectionProps) {
    return useQuery([Keys.GET_FIELD_COLLECTION, props.collectionId], () =>
        getFieldCollection(props)
    )
}

export function useUpdateField() {
    const queryClient = useQueryClient()
    return useMutation(updateField, {
        onSettled: async (data) => {
            await queryClient.invalidateQueries([
                Keys.GET_FIELD_COLLECTION,
                data?.field?.parent,
            ])
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data)
            showNotification({
                title: 'Error',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
    })
}

export function useDeleteField() {
    const queryClient = useQueryClient()
    return useMutation(deleteField, {
        mutationKey: Keys.DELETE_FIELD,
        onSettled: async (data) => {
            await queryClient.invalidateQueries([
                Keys.GET_FIELD_COLLECTION,
                data?.field?.parent,
            ])
        },
        onError: (error: AxiosError<{ message: string }>) => {
            showNotification({
                title: 'Could not delete field',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
    })
}
