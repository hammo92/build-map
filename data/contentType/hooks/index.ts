import { ContentType } from "@lib/contentType/data/contentType.model";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { moveInArray } from "utils/arrayModify";
import { Keys } from "../constants";
import {
    ContentTypeResponse,
    createContentType,
    createContentTypeField,
    deleteContentType,
    deleteContentTypeField,
    getContentType,
    getOrganisationContentTypes,
    reorderContentTypeFields,
    updateContentType,
    updateContentTypeField,
} from "../queries";

export function useCreateContentType() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createContentType, {
        mutationKey: Keys.CREATE_CONTENT_TYPE,
        onSuccess: ({ newContentType }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
            notifications.showNotification({
                title: `${newContentType.name} created`,
                message: `Created new content type successfully`,
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

export function useGetContentType(contentTypeId: string) {
    return useQuery([Keys.GET_CONTENT_TYPE, contentTypeId], () =>
        getContentType(contentTypeId)
    );
}

export function useUpdateContentType() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateContentType, {
        mutationKey: Keys.UPDATE_CONTENT_TYPE,
        onMutate: async ({ contentTypeId, name, status }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTypeId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTypeResponse>(queryId);

            if (currentData?.contentType) {
                const { contentType } = currentData;
                if (name) {
                    contentType.name = name;
                }
                if (status) {
                    contentType.status = status;
                }

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentType,
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
                data?.contentType.id,
            ]);
            // also force refresh of organisation content types as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useDeleteContentType() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteContentType, {
        mutationKey: Keys.DELETE_CONTENT_TYPE,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
            notifications.showNotification({
                title: `${data.contentType.name} deleted`,
                message: `Content Type deleted successfully`,
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

export function useGetOrganisationContentTypes(
    organisationId: string,
    initialData?: { contentTypes: CleanedCamel<ContentType>[] }
) {
    return useQuery(
        Keys.GET_ORGANISATION_CONTENT_TYPES,
        () => getOrganisationContentTypes(organisationId),
        { initialData }
    );
}

export function useCreateContentTypeField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createContentTypeField, {
        mutationKey: Keys.CREATE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTypeId, fieldDetails }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTypeId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTypeResponse>(queryId);

            if (currentData?.contentType) {
                const { contentType } = currentData;
                // add new field to end with placeholder default values
                contentType.fields.push({
                    ...fieldDetails,
                    id: "newField",
                    active: true,
                });

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentType,
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
                data?.contentType.id,
            ]);
            // also force refresh of organisation content types as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useUpdateContentTypeField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateContentTypeField, {
        mutationKey: Keys.UPDATE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTypeId, fieldDetails }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTypeId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTypeResponse>(queryId);

            if (currentData?.contentType) {
                const { contentType } = currentData;
                const fieldIndex = contentType.fields.findIndex(
                    ({ id }) => id === fieldDetails.id
                );
                contentType.fields[fieldIndex] = {
                    ...contentType.fields[fieldIndex],
                    ...fieldDetails,
                };

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentType,
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
                data?.contentType.id,
            ]);
        },
    });
}

export function useDeleteContentTypeField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteContentTypeField, {
        mutationKey: Keys.DELETE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTypeId, fieldId }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTypeId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTypeResponse>(queryId);

            if (currentData?.contentType) {
                const { contentType } = currentData;
                const updatedFields = contentType.fields.filter(
                    ({ id }) => id !== fieldId
                );
                contentType.fields = updatedFields;
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentType,
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
                data?.contentType.id,
            ]);
            // also force refresh of organisation content types as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TYPES);
        },
    });
}

export function useReorderContentTypeFields() {
    const notifications = useNotifications();
    const queryClient = useQueryClient();
    return useMutation(reorderContentTypeFields, {
        mutationKey: Keys.DELETE_CONTENT_TYPE_FIELD,
        onMutate: async ({ contentTypeId, fromIndex, toIndex }) => {
            const queryId = [Keys.GET_CONTENT_TYPE, contentTypeId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<ContentTypeResponse>(queryId);

            if (currentData?.contentType) {
                const { contentType } = currentData;
                const updatedContentTypeFields = moveInArray(
                    contentType!.fields,
                    fromIndex,
                    toIndex
                );
                contentType.fields = updatedContentTypeFields;

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        contentType,
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
                data?.contentType.id,
            ]);
        },
    });
}
