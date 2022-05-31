import {
    FormTemplate,
    FormTemplateField,
} from "@lib/formTemplate/data/formTemplate.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedSnake, ModelRequired } from "type-helpers";

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

export async function getOrganisationFormTemplates(organisationId: string) {
    const { data } = await apiClient.get<{
        formTemplates: CleanedSnake<FormTemplate>[];
    }>(`/organisations/${organisationId}/formTemplates`);
    return data;
}

export async function createFormTemplateField({
    formTemplateId,
    fieldDetails,
}: {
    formTemplateId: string;
    fieldDetails: ModelRequired<FormTemplateField, "name" | "type">;
}) {
    const { data } = await apiClient.post<{
        newField: CleanedSnake<FormTemplateField>;
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
        updatedField: CleanedSnake<FormTemplateField>;
    }>(`/formTemplates/${formTemplateId}/fields/${fieldDetails.id}`, {
        fieldDetails,
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
        deletedField: CleanedSnake<FormTemplateField>;
    }>(`/formTemplates/${formTemplateId}/fields/${fieldId}`);
    return camelcaseKeys(data);
}
