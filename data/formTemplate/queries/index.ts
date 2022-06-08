import {
    FormTemplate,
    FormTemplateField,
} from "@lib/formTemplate/data/formTemplate.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedSnake, ModelRequired } from "type-helpers";

export type FormTemplateResponse = {
    formTemplate: FormTemplate;
};

export async function createFormTemplate({
    name,
    organisationId,
}: {
    name: string;
    organisationId: string;
}) {
    const { data } = await apiClient.post<{
        newFormTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates`, {
        name,
        organisationId,
    });
    return camelcaseKeys(data);
}

export async function getFormTemplate(formTemplateId: string) {
    const { data } = await apiClient.get<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function updateFormTemplate({
    formTemplateId,
    name,
    status,
}: {
    formTemplateId: string;
    name?: string;
    status?: "draft" | "published";
}) {
    const { data } = await apiClient.patch<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}`, {
        name,
        status,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function deleteFormTemplate(formTemplateId: string) {
    const { data } = await apiClient.delete<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getOrganisationFormTemplates(organisationId: string) {
    const { data } = await apiClient.get<{
        formTemplates: CleanedSnake<FormTemplate>[];
    }>(`/organisations/${organisationId}/formTemplates`);
    return camelcaseKeys(data, { deep: true });
}

export async function createFormTemplateField({
    formTemplateId,
    fieldDetails,
}: {
    formTemplateId: string;
    fieldDetails: ModelRequired<FormTemplateField, "name" | "type">;
}) {
    const { data } = await apiClient.post<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}/fields`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function updateFormTemplateField({
    formTemplateId,
    fieldDetails,
}: {
    formTemplateId: string;
    fieldDetails: ModelRequired<FormTemplateField, "id">;
}) {
    const { data } = await apiClient.patch<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}/fields/${fieldDetails.id}`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function reorderFormTemplateFields({
    formTemplateId,
    fromIndex,
    toIndex,
}: {
    formTemplateId: string;
    fromIndex: number;
    toIndex: number;
}) {
    const { data } = await apiClient.post<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}/reorderFields`, {
        fromIndex,
        toIndex,
    });
    return camelcaseKeys(data);
}

export async function deleteFormTemplateField({
    formTemplateId,
    fieldId,
}: {
    formTemplateId: string;
    fieldId: string;
}) {
    const { data } = await apiClient.delete<{
        formTemplate: CleanedSnake<FormTemplate>;
    }>(`/formTemplates/${formTemplateId}/fields/${fieldId}`);
    return camelcaseKeys(data);
}
