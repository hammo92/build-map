import { content } from "@lib/content/endpoints";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Property } from "@lib/contentTemplate/data/types";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";
import { moveInArray } from "utils/arrayModify";
import { Keys } from "../constants";
import {
    ContentTemplateResponse,
    createContentTemplate,
    createProperty,
    deleteContentTemplate,
    deleteProperty,
    deletePropertyGroup,
    getContentTemplate,
    getOrganisationContentTemplates,
    getProjectContentTemplates,
    reorderProperties,
    updateContentTemplate,
    updateProperty,
    updatePropertyGroups,
} from "../queries";

export function useCreateContentTemplate() {
    const queryClient = useQueryClient();

    return useMutation(createContentTemplate, {
        mutationKey: Keys.CREATE_CONTENT_TEMPLATE,
        onSuccess: ({ newContentTemplate }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
            showNotification({
                title: `${newContentTemplate.name} created`,
                message: `Created new content template successfully`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
    });
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
    );
}

export function useUpdateContentTemplate() {
    const queryClient = useQueryClient();

    return useMutation(updateContentTemplate, {
        mutationKey: Keys.UPDATE_CONTENT_TEMPLATE,
        onMutate: async ({ contentTemplateId, name, status, icon, title }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

            // optimistically update value locally
            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                if (name) {
                    contentTemplate.name = name;
                }
                if (status) {
                    contentTemplate.status = status;
                }
                if (icon) {
                    contentTemplate.icon = icon;
                }
                if (title) {
                    contentTemplate.title = title;
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
            showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
        },
    });
}

export function useDeleteContentTemplate() {
    const queryClient = useQueryClient();

    return useMutation(deleteContentTemplate, {
        mutationKey: Keys.DELETE_CONTENT_TEMPLATE,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
            showNotification({
                title: `${data.contentTemplate.name} deleted`,
                message: `Content Template deleted successfully`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
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
        [Keys.GET_ORGANISATION_CONTENT_TEMPLATES, organisationId],
        () => getOrganisationContentTemplates(organisationId),
        {
            initialData,
        }
    );
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
    );
}

export function useCreateProperty() {
    const queryClient = useQueryClient();

    return useMutation(createProperty, {
        mutationKey: Keys.CREATE_CONTENT_TEMPLATE_FIELD,
        onMutate: async ({ contentTemplateId, fieldProperties, groupId }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);
            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);
            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                // add new field to end with placeholder default values
                contentTemplate.fields.push({
                    ...(fieldProperties as Property),
                    id: "newProperty",
                });

                contentTemplate.propertyGroups[groupId ?? "1"].children.push("newProperty");
                //contentTemplate.propertyGroups[groupId ?? "1"].children.push("placeHolder");

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
            showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            console.log("settled");
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
        },
    });
}

export function useUpdateProperty() {
    const queryClient = useQueryClient();

    return useMutation(updateProperty, {
        mutationKey: Keys.UPDATE_CONTENT_TEMPLATE_FIELD,
        onMutate: async ({ contentTemplateId, fieldProperties }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const fieldIndex = contentTemplate.fields.findIndex(
                    ({ id }) => id === fieldProperties.id
                );

                const { type, id, ...rest } = fieldProperties;

                contentTemplate.fields[fieldIndex] = {
                    ...contentTemplate.fields[fieldIndex],
                    ...rest,
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
            showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
        },
    });
}

export function useUpdatePropertyGroups() {
    const queryClient = useQueryClient();

    return useMutation(updatePropertyGroups, {
        mutationKey: Keys.UPDATE_CONTENT_TEMPLATE_PROPERTY_GROUPS,
        onMutate: async ({ contentTemplateId, propertyGroups }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                contentTemplate.propertyGroups = propertyGroups;

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
            showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
        },
    });
}

export function useDeleteProperty() {
    const queryClient = useQueryClient();

    return useMutation(deleteProperty, {
        mutationKey: Keys.DELETE_CONTENT_TEMPLATE_FIELD,
        onMutate: async ({ contentTemplateId, fieldId }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const updatedFields = contentTemplate.fields.filter(({ id }) => id !== fieldId);
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
            showNotification({
                title: "Could not delete field",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
        },
    });
}

export function useDeletePropertyGroup() {
    const queryClient = useQueryClient();

    return useMutation(deletePropertyGroup, {
        mutationKey: Keys.DELETE_CONTENT_TEMPLATE_FIELD,
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
                title: "Could not delete field",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
            // also force refresh of organisation content templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_CONTENT_TEMPLATES);
        },
    });
}

export function useReorderProperties() {
    const queryClient = useQueryClient();
    return useMutation(reorderProperties, {
        mutationKey: Keys.DELETE_CONTENT_TEMPLATE_FIELD,
        onMutate: async ({ contentTemplateId, fromIndex, toIndex }) => {
            const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

            if (currentData?.contentTemplate) {
                const { contentTemplate } = currentData;
                const updatedProperties = moveInArray(contentTemplate!.fields, fromIndex, toIndex);
                contentTemplate.fields = updatedProperties;

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
            showNotification({
                title: "Could not reorder fields",
                message: error?.response?.data.message,
                color: "red",
            });
        },
        onSettled: (data) => {
            queryClient.invalidateQueries([Keys.GET_CONTENT_TEMPLATE, data?.contentTemplate.id]);
        },
    });
}
