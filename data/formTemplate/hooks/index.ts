import { Keys } from "../constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import {
    createFormTemplate,
    createFormTemplateField,
    deleteFormTemplateField,
    getOrganisationFormTemplates,
    updateFormTemplateField,
} from "../queries";

export function useCreateFormTemplate() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(createFormTemplate, {
        mutationKey: Keys.CREATE_FORM_TEMPLATE,
        onSuccess: ({ newFormTemplate }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${newFormTemplate.name} created`,
                message: `Created New Form Template Successfully`,
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
        onSuccess: ({ newField }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${newField.name} created`,
                message: `Added new field successfully`,
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

export function useUpdateFormTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(updateFormTemplateField, {
        mutationKey: Keys.CREATE_FORM_TEMPLATE_FIELD,
        onSuccess: ({ updatedField }) => {
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${updatedField.name} updated`,
                message: `Form field updated Successfully`,
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

export function useDeleteFormTemplateField() {
    const queryClient = useQueryClient();
    const notifications = useNotifications();
    return useMutation(deleteFormTemplateField, {
        mutationKey: Keys.DELETE_FORM_TEMPLATE_FIELD,
        onSuccess: (data) => {
            console.log("data", data);
            queryClient.invalidateQueries(Keys.GET_ORGANISATION_TEMPLATES);
            notifications.showNotification({
                title: `${data.deletedField.name} deleted`,
                message: `Form field deleted Successfully`,
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
