import { Keys } from "../constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import {
    createFormTemplate,
    createFormTemplateField,
    deleteFormTemplate,
    deleteFormTemplateField,
    FormTemplateResponse,
    getFormTemplate,
    getOrganisationFormTemplates,
    reorderFormTemplateFields,
    updateFormTemplate,
    updateFormTemplateField,
} from "../queries";
import { CleanedSnake } from "type-helpers";
import { FormTemplate } from "@lib/formTemplate/data/formTemplate.model";
import { moveInArray } from "utils/arrayModify";

export function useCreateFormTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createFormTemplate, {
        mutationKey: Keys.CREATE_FORM_TEMPLATE,
        onSuccess: ({ newFormTemplate }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${newFormTemplate.name} created`,
                message: `Created new form template successfully`,
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

export function useGetFormTemplate(formTemplateId: string) {
    return useQuery([Keys.GET_FORM_TEMPLATE, formTemplateId], () =>
        getFormTemplate(formTemplateId)
    );
}

export function useUpdateFormTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateFormTemplate, {
        mutationKey: Keys.UPDATE_FORM_TEMPLATE,
        onMutate: async ({ formTemplateId, name, status }) => {
            const queryId = [Keys.GET_FORM_TEMPLATE, formTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<FormTemplateResponse>(queryId);

            if (currentData?.formTemplate) {
                const { formTemplate } = currentData;
                if (name) {
                    formTemplate.name = name;
                }
                if (status) {
                    formTemplate.status = status;
                }

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        formTemplate,
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
                Keys.GET_FORM_TEMPLATE,
                data?.formTemplate.id,
            ]);
            // also force refresh of organisation form templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
        },
    });
}

export function useDeleteFormTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteFormTemplate, {
        mutationKey: Keys.DELETE_FORM_TEMPLATE,
        onSuccess: (data) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${data.formTemplate.name} deleted`,
                message: `Form Template deleted successfully`,
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

export function useGetOrganisationFormTemplates(organisationId: string) {
    return useQuery(Keys.GET_ORGANISATION_TEMPLATES, () =>
        getOrganisationFormTemplates(organisationId)
    );
}

export function useCreateFormTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createFormTemplateField, {
        mutationKey: Keys.CREATE_FORM_TEMPLATE_FIELD,
        onMutate: async ({ formTemplateId, fieldDetails }) => {
            const queryId = [Keys.GET_FORM_TEMPLATE, formTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<FormTemplateResponse>(queryId);

            if (currentData?.formTemplate) {
                const { formTemplate } = currentData;
                // add new field to end with placeholder default values
                formTemplate.fields.push({
                    ...fieldDetails,
                    id: "newField",
                    active: true,
                });

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        formTemplate,
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
                Keys.GET_FORM_TEMPLATE,
                data?.formTemplate.id,
            ]);
            // also force refresh of organisation form templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
        },
    });
}

export function useUpdateFormTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateFormTemplateField, {
        mutationKey: Keys.UPDATE_FORM_TEMPLATE_FIELD,
        onMutate: async ({ formTemplateId, fieldDetails }) => {
            const queryId = [Keys.GET_FORM_TEMPLATE, formTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<FormTemplateResponse>(queryId);

            if (currentData?.formTemplate) {
                const { formTemplate } = currentData;
                const fieldIndex = formTemplate.fields.findIndex(
                    ({ id }) => id === fieldDetails.id
                );
                formTemplate.fields[fieldIndex] = {
                    ...formTemplate.fields[fieldIndex],
                    ...fieldDetails,
                };

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        formTemplate,
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
                Keys.GET_FORM_TEMPLATE,
                data?.formTemplate.id,
            ]);
        },
    });
}

export function useDeleteFormTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteFormTemplateField, {
        mutationKey: Keys.DELETE_FORM_TEMPLATE_FIELD,
        onMutate: async ({ formTemplateId, fieldId }) => {
            const queryId = [Keys.GET_FORM_TEMPLATE, formTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<FormTemplateResponse>(queryId);

            if (currentData?.formTemplate) {
                const { formTemplate } = currentData;
                const updatedFields = formTemplate.fields.filter(
                    ({ id }) => id !== fieldId
                );
                formTemplate.fields = updatedFields;
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        formTemplate,
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
                Keys.GET_FORM_TEMPLATE,
                data?.formTemplate.id,
            ]);
            // also force refresh of organisation form templates as this will need to update
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
        },
    });
}

export function useReorderFormTemplateFields() {
    const notifications = useNotifications();
    const queryClient = useQueryClient();
    return useMutation(reorderFormTemplateFields, {
        mutationKey: Keys.DELETE_FORM_TEMPLATE_FIELD,
        onMutate: async ({ formTemplateId, fromIndex, toIndex }) => {
            const queryId = [Keys.GET_FORM_TEMPLATE, formTemplateId];
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData =
                queryClient.getQueryData<FormTemplateResponse>(queryId);

            if (currentData?.formTemplate) {
                const { formTemplate } = currentData;
                const updatedTemplateFields = moveInArray(
                    formTemplate!.fields,
                    fromIndex,
                    toIndex
                );
                formTemplate.fields = updatedTemplateFields;

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        formTemplate,
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
                Keys.GET_FORM_TEMPLATE,
                data?.formTemplate.id,
            ]);
        },
    });
}
