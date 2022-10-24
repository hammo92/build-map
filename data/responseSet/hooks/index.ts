import { showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CleanedCamel } from 'type-helpers'
import { Keys } from '../constants'
import {
    createResponseSet,
    deleteResponseSet,
    getResponseSet,
    getResponseSetCollection,
    updateResponseSet,
} from '../queries'
import { ResponseSet } from '@lib/responseSet/data/responseSet.model'
import { ulid } from 'ulid'

export function useCreateResponseSet() {
    const queryClient = useQueryClient()
    return useMutation(createResponseSet, {
        mutationKey: Keys.CREATE_RESPONSE_SET,
        onMutate: async ({ name, parent, options }) => {
            const queryId = [Keys.GET_RESPONSE_SET_COLLECTION, parent]

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                responseSets: CleanedCamel<ResponseSet>[]
            }>(queryId)

            if (currentData?.responseSets) {
                const { responseSets } = currentData

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => ({
                    responseSets: [
                        ...responseSets,
                        { name, parent, options, id: ulid() },
                    ],
                }))
            }
        },
        onSuccess: async ({ responseSet }) => {
            await queryClient.invalidateQueries([
                Keys.GET_RESPONSE_SET_COLLECTION,
                responseSet.parent,
            ])
            showNotification({
                title: `Success`,
                message: `Created new response set`,
                color: 'green',
            })
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

export function useGetResponseSet(
    responseSetId: string,
    initialData?: {
        responseSet?: CleanedCamel<ResponseSet>
    }
) {
    return useQuery(
        [Keys.GET_RESPONSE_SET, responseSetId],
        () => getResponseSet({ responseSetId }),
        {
            //refetchInterval: 1000,
            initialData,
        }
    )
}

export function useGetResponseSetCollection(
    collectionId: string,
    initialData?: {
        responseSets?: CleanedCamel<ResponseSet>[]
    }
) {
    return useQuery(
        [Keys.GET_RESPONSE_SET_COLLECTION, collectionId],
        () => getResponseSetCollection({ collectionId }),
        {
            //refetchInterval: 1000,
            initialData,
        }
    )
}

export function useUpdateResponseSet() {
    const queryClient = useQueryClient()
    return useMutation(updateResponseSet, {
        onSuccess: async (data) => {
            await Promise.all([
                queryClient.invalidateQueries([
                    Keys.GET_RESPONSE_SET,
                    data?.responseSet.id,
                ]),
                queryClient.invalidateQueries([
                    Keys.GET_RESPONSE_SET_COLLECTION,
                    data?.responseSet.parent,
                ]),
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

export function useDeleteResponseSet() {
    const queryClient = useQueryClient()
    return useMutation(deleteResponseSet, {
        onSettled: async (data) => {
            await Promise.all([
                queryClient.invalidateQueries([
                    Keys.GET_RESPONSE_SET,
                    data?.responseSet.id,
                ]),
                queryClient.invalidateQueries([
                    Keys.GET_RESPONSE_SET_COLLECTION,
                    data?.responseSet.parent,
                ]),
            ])
            showNotification({
                title: `Content deleted`,
                message: `Content Template deleted successfully`,
                color: 'green',
            })
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
