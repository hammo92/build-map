import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";

import { Keys } from "../constants";
import {
    createProject,
    deleteProject,
    getMyProjects,
    getOrgProjects,
} from "../queries";

export function useCreateProject() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createProject, {
        mutationKey: Keys.CREATE_PROJECT,
        /*onMutate: async (newProject) => {
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(Keys.GET_MY_PROJECTS);
            // Snapshot the previous value
            const previousProjects = queryClient.getQueryData(
                Keys.GET_MY_PROJECTS
            );
            // Optimistically update to the new value
            queryClient.setQueryData(Keys.GET_MY_PROJECTS, (old) => [
                ...old,
                newProject,
            ]);
            // Return a context object with the snapshotted value
            return { previousProjects };
        },*/
        onSuccess: ({ project }) => {
            queryClient.invalidateQueries(Keys.GET_MY_PROJECTS);
            notifications.showNotification({
                title: `${project.name} created`,
                message: `Successfully setup new project`,
                color: "green",
            });
        },
        onError: (
            error: AxiosError<{ message: string }>,
            newProject,
            context
        ) => {
            /*queryClient.setQueryData(
                Keys.GET_MY_PROJECTS,
                context.previousProjects
            );*/
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
    });
}

export function useDeleteProject() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteProject, {
        mutationKey: Keys.DELETE_PROJECT,
        onSuccess: ({ project }) => {
            queryClient.invalidateQueries(Keys.GET_MY_PROJECTS);
            notifications.showNotification({
                title: `${project.name}  deleted`,
                message: `Successfully deleted project`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
    });
}

export function useGetMyProjects() {
    return useQuery(Keys.GET_MY_PROJECTS, getMyProjects);
}

export function useGetOrgProjects({
    organisationId,
}: {
    organisationId: string;
}) {
    return useQuery([Keys.GET_MY_PROJECTS, organisationId], () =>
        getOrgProjects({ organisationId })
    );
}
