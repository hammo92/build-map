import { Project } from '@lib/project/data/projectModel'
import { showNotification } from '@mantine/notifications'
import { AxiosError } from 'axios'
import { useMutation, useQuery, useQueryClient } from 'react-query'
import { CleanedCamel } from 'type-helpers'

import { Keys } from '../constants'
import {
    createProject,
    deleteProject,
    getMyProjects,
    getOrgProjects,
} from '../queries'

export function useCreateProject() {
    const queryClient = useQueryClient()

    return useMutation(createProject, {
        mutationKey: Keys.CREATE_PROJECT,
        onMutate: async ({ name }) => {
            const queryId = Keys.GET_MY_PROJECTS

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                projects: CleanedCamel<Project>[]
            }>(queryId)
            console.log('currentData', currentData)

            if (currentData?.projects) {
                const { projects } = currentData

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => ({
                    projects: [...projects, { name }],
                }))
            }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries(Keys.GET_MY_PROJECTS)
        },
        onError: (
            error: AxiosError<{ message: string }>,
            newProject,
            context
        ) => {
            showNotification({
                title: 'Error',
                message: error?.response?.data.message,
                color: 'red',
            })
        },
    })
}

export function useDeleteProject() {
    const queryClient = useQueryClient()

    return useMutation(deleteProject, {
        mutationKey: Keys.DELETE_PROJECT,
        onMutate: async ({ projectId }) => {
            const queryId = Keys.GET_MY_PROJECTS

            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId)

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                projects: CleanedCamel<Project>[]
            }>(queryId)

            if (currentData?.projects) {
                const { projects } = currentData

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => ({
                    projects: [
                        ...projects.filter(({ id }) => id !== projectId),
                    ],
                }))
            }
        },
        onSuccess: ({ project }) => {
            queryClient.invalidateQueries(Keys.GET_MY_PROJECTS)
            showNotification({
                title: `${project.name}  deleted`,
                message: `Successfully deleted project`,
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

export function useGetMyProjects() {
    return useQuery(Keys.GET_MY_PROJECTS, getMyProjects)
}

export function useGetOrgProjects({
    organisationId,
}: {
    organisationId: string
}) {
    return useQuery([Keys.GET_MY_PROJECTS, organisationId], () =>
        getOrgProjects({ organisationId })
    )
}
