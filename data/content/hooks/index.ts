import { Content } from '@lib/content/data/content.model'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Field } from '@lib/field/data/field.model'
import { showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CleanedCamel } from 'type-helpers'
import { Keys } from '../constants'
import {
    createContent,
    deleteContent,
    deleteGroup,
    getContent,
    getContentOfTemplate,
    repeatGroup,
    updateContentFields,
    updateContentFromTemplate,
    updateContentStatus,
    updateContentValues,
} from '../queries'

export function useCreateContent() {
    const queryClient = useQueryClient()
    return useMutation(createContent, {
        mutationKey: Keys.CREATE_CONTENT,
        onSuccess: ({ newContent }) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            showNotification({
                title: `Success`,
                message: `Created new content successfully`,
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

export function useGetContent(
    contentId: string,
    initialData?: {
        content?: CleanedCamel<Content>
        contentTemplate?: CleanedCamel<ContentTemplate>
        contentFields?: CleanedCamel<Field>[]
    }
) {
    return useQuery(
        [Keys.GET_CONTENT, contentId],
        () => getContent(contentId),
        {
            //refetchInterval: 1000,
            initialData,
        }
    )
}

export function useDeleteContent() {
    const queryClient = useQueryClient()
    return useMutation(deleteContent, {
        onMutate: async (contentId) => {
            const queryId = Keys.GET_PROJECT_CONTENT_OF_TYPE
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)
            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                content: CleanedCamel<Content>[]
            }>(queryId)

            if (currentData?.content) {
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        ...currentData,
                        content: currentData.content.filter(
                            ({ id }) => id !== contentId
                        ),
                    }
                })
            }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

// get all content entries which use contentTemplate
export function useGetProjectContentOfType({
    projectId,
    contentTemplateId,
    initialData,
}: {
    projectId: string
    contentTemplateId: string
    initialData?: {
        content: CleanedCamel<Content>[]
        contentTemplate: CleanedCamel<ContentTemplate>
    }
}) {
    return useQuery(
        [Keys.GET_PROJECT_CONTENT_OF_TYPE, contentTemplateId],
        () => getContentOfTemplate({ projectId, contentTemplateId }),
        {
            initialData,
        }
    )
}

export function useUpdateContentStatus() {
    const queryClient = useQueryClient()
    return useMutation(updateContentStatus, {
        onMutate: async ({ contentId, status }) => {
            const queryId = [Keys.GET_CONTENT, contentId]
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)
            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                content: CleanedCamel<Content>
                contentTemplate: CleanedCamel<ContentTemplate>
            }>(queryId)

            if (currentData?.content) {
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        content: { ...currentData.content, status },
                        contentTemplate: currentData.contentTemplate,
                    }
                })
            }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

export function useUpdateContentValues() {
    const queryClient = useQueryClient()
    return useMutation(updateContentValues, {
        mutationKey: Keys.CREATE_CONTENT,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

export function useUpdateContentFields() {
    const queryClient = useQueryClient()
    return useMutation(updateContentFields, {
        mutationKey: Keys.CREATE_CONTENT,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

export function useRepeatGroup() {
    const queryClient = useQueryClient()
    return useMutation(repeatGroup, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

export function useDeleteGroup() {
    const queryClient = useQueryClient()
    return useMutation(deleteGroup, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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

export function useUpdateContentFromTemplate() {
    const queryClient = useQueryClient()
    return useMutation(updateContentFromTemplate, {
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_PROJECT_CONTENT_OF_TYPE)
            queryClient.invalidateQueries([Keys.GET_CONTENT, data?.content.id])
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
