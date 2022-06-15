import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { moveInArray } from "utils/arrayModify";
import { Keys } from "../constants";
import {
    ContentTemplateResponse,
    createContentTemplate,
    createContentTemplateField,
    deleteContentTemplate,
    deleteContentTemplateField,
    getContentTemplate,
    getOrganisationContentTemplates,
    reorderContentTemplateFields,
    updateContentTemplate,
    updateContentTemplateField,
} from "../queries";

export function useCreateContentTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createContentTemplate, {
        mutationKey: Keys.CREATE_CONTENT_TYPE,
        onSuccess: ({ newContentTemplate }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
            notifications.showNotification({
                title: `${newContentTemplate.name} created`,
                message: `Created new content template successfully`,
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

export function useGetContentTemplate(contentTemplateId: string) {
    return useQuery([Keys.GET_CONTENT_TYPE, contentTemplateId], () =>
        getContentTemplate(contentTemplateId)
    );
}

export function useUpdateContentTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateContentTemplate, {
        mutationKey: Keys.UPDATE_CONTENT_TYPE,
        onMutate: async ({ contentTemplateId, name, status }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                if (name) {
                    contentTemplate.name = name;
                }
                if (status) {
                    contentTemplate.status = status;
                }

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    };
                });
            }
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TYPE,
                data?.contentTemplate.id,
            ]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useDeleteContentTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteContentTemplate, {
        mutationKey: Keys.DELETE_CONTENT_TYPE,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
            notifications.showNotification({
                title: `${data.contentTemplate.name} deleted`,
                message: `Content Template deleted successfully`,
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

export function useGetOrganisationContentTemplates(
    organisationId: string,
    initialData?: { contentTemplates: CleanedCamel<ContentTemplate>[] }
) {
    return useQuery(
        Keys.GET_ORGANISATION_CONTENT_TYPES,
        () => getOrganisationContentTemplates(organisationId),
        { initialData }
    );
}

export function useCreateContentTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createContentTemplateField, {
        mutationKey: Keys.CREATE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTemplateId, fieldDetails }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                // add new field to end with placeholder default values
                contentTemplate.fields.push({
                    ...fieldDetails,
                    id: "newField",
                    active: true,
                });

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { currentData };
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TYPE,
                data?.contentTemplate.id,
            ]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useUpdateContentTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateContentTemplateField, {
        mutationKey: Keys.UPDATE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTemplateId, fieldDetails }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const fieldIndex = contentTemplate.fields.findIndex(
                    ({ id }) => id === fieldDetails.id
                );
                contentTemplate.fields[fieldIndex] = {
                    ...contentTemplate.fields[fieldIndex],
                    ...fieldDetails,
                };

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { currentData };
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TYPE,
                data?.contentTemplate.id,
            ]);
        },
    });
}

export function useDeleteContentTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteContentTemplateField, {
        mutationKey: Keys.DELETE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTemplateId, fieldId }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const updatedFields = contentTemplate.fields.filter(
                    ({ id }) => id !== fieldId
                );
                contentTemplate.fields = updatedFields;
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { currentData };
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Could not reorder fields",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TYPE,
                data?.contentTemplate.id,
            ]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useReorderContentTemplateFields() {
    const notifications = useNotifications();
    const queryClient = useQueryClient();
    return useMutation(reorderContentTemplateFields, {
        mutationKey: Keys.DELETE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTemplateId, fromIndex, toIndex }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const updatedContentTemplateFields = moveInArray(
                    contentTemplate!.fields,
                    fromIndex,
                    toIndex
                );
                contentTemplate.fields = updatedContentTemplateFields;

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentTemplate,
                    };
                });
            }

            // Return a context object with the snapshotted value
            return { currentData };
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Could not reorder fields",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([
                Keys.GET_CONTENT_TYPE,
                data?.contentTemplate.id,
            ]);
        },
    });
}
