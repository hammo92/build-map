import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'

import { showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CleanedCamel } from 'type-helpers'
import { Keys } from '../constants'
import {
    ContentTemplateResponse,
    createContentTemplate,
    deleteContentTemplate,
    getContentTemplate,
    getOrganisationContentTemplates,
    getProjectContentTemplates,
    updateContentTemplate,
    updateContentTemplateProperties,
} from '../queries'

export function useCreateContentTemplate() {
    const queryClient = useQueryClient()

    return useMutation(createContentTemplate, {
        mutationKey: Keys.CREATE_CONTENT_TEMPLATE,
        onSuccess: ({ newContentTemplate }) => {
            queryClient.invalidateQueries(
                Keys.GET_ORGANISATION_CONTENT_TEMPLATES
            )
            showNotification({
                title: `${newContentTemplate.name} created`,
                message: `Created new content template successfully`,
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

export function useGetContentTemplate(
    contentTemplateId: string,
    initialData?: { contentTemplate: CleanedCamel<ContentTemplate> }
) {
    return useQuery(
        [Keys.GET_CONTENT_TEMPLATE, contentTemplateId],
        () => getContentTemplate(contentTemplateId),
        {
            initialData,
        }
    )
}

export function useUpdateContentTemplate() {
    const queryClient = useQueryClient()

    return useMutation(updateContentTemplate, {
        mutationKey: Keys.UPDATE_CONTENT_TEMPLATE,
        onMutate: async ({ contentTemplateId, name, status, icon, title }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId]
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId)

            // optimistically update value locally
            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData
                if (name) {
                    contentTemplate.name = name
                }
                if (status) {
                    contentTemplate.status = status
                }
                if (icon) {
                    contentTemplate.icon = icon
                }

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    }
                })
            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data)
            showNotification({
                title: 'Error',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TEMPLATE,
                data?.contentTemplate.id,
            ])
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(
                Keys.GET_ORGANISATION_CONTENT_TEMPLATES
            )
        },
    })
}

export function useUpdateContentTemplateProperties() {
    const queryClient = useQueryClient()

    return useMutation(updateContentTemplateProperties, {
        mutationKey: Keys.UPDATE_CONTENT_TEMPLATE_PROPERTIES,
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data)
            showNotification({
                title: 'Error',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TEMPLATE,
                data?.contentTemplate.id,
            ])
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(
                Keys.GET_ORGANISATION_CONTENT_TEMPLATES
            )
        },
    })
}

export function useDeleteContentTemplate() {
    const queryClient = useQueryClient()

    return useMutation(deleteContentTemplate, {
        mutationKey: Keys.DELETE_CONTENT_TEMPLATE,
        onSuccess: (data) => {
            queryClient.invalidateQueries(
                Keys.GET_ORGANISATION_CONTENT_TEMPLATES
            )
            showNotification({
                title: `${data.contentTemplate.name} deleted`,
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

export function useGetOrganisationContentTemplates(
    organisationId: string,
    initialData?: { contentTemplates: CleanedCamel<ContentTemplate>[] }
) {
    return useQuery(
        [Keys.GET_ORGANISATION_CONTENT_TEMPLATES, organisationId],
        () => getOrganisationContentTemplates(organisationId),
        {
            initialData,
        }
    )
}

export function useGetProjectContentTemplates(
    projectId: string,
    initialData?: { contentTemplates: CleanedCamel<ContentTemplate>[] }
) {
    return useQuery(
        [Keys.GET_PROJECT_CONTENT_TEMPLATES, projectId],
        () => getProjectContentTemplates(projectId),
        {
            initialData,
        }
    )
}
