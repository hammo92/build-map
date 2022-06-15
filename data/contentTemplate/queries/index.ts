import {
    ContentTemplate,
    ContentTemplateField,
    ContentTemplateIcon,
} from "@lib/contentTemplate/data/contentTemplate.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { json } from "stream/consumers";
import { CleanedCamel, CleanedSnake, ModelRequired } from "type-helpers";

export type ContentTemplateResponse = {
    contentTemplate: CleanedCamel<ContentTemplate>;
};

export async function createContentTemplate({
    name,
    organisationId,
    icon,
    type,
}: {
    name: string;
    organisationId: string;
    icon: ContentTemplateIcon;
    type: ContentTemplate["type"];
}) {
    const { data } = await apiClient.post<{
        newContentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates`, {
        name,
        organisationId,
        icon,
        type,
    });
    return camelcaseKeys(data);
}

export async function getContentTemplate(contentTemplateId: string) {
    const { data } = await apiClient.get<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function updateContentTemplate({
    contentTemplateId,
    name,
    status,
    icon,
}: {
    contentTemplateId: string;
    name?: string;
    status?: "draft" | "published";
    icon?: ContentTemplateIcon;
}) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}`, {
        name,
        status,
        icon,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function deleteContentTemplate(contentTemplateId: string) {
    const { data } = await apiClient.delete<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getOrganisationContentTemplates(organisationId: string) {
    const { data } = await apiClient.get(
        `/organisations/${organisationId}/contentTemplates`
    );
    return camelcaseKeys(data, { deep: true }) as {
        contentTemplates: CleanedCamel<ContentTemplate>[];
    };
}

export async function createContentTemplateField({
    contentTemplateId,
    fieldDetails,
}: {
    contentTemplateId: string;
    fieldDetails: ModelRequired<ContentTemplateField, "name" | "type">;
}) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function updateContentTemplateField({
    contentTemplateId,
    fieldDetails,
}: {
    contentTemplateId: string;
    fieldDetails: ModelRequired<ContentTemplateField, "id">;
}) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields/${fieldDetails.id}`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function reorderContentTemplateFields({
    contentTemplateId,
    fromIndex,
    toIndex,
}: {
    contentTemplateId: string;
    fromIndex: number;
    toIndex: number;
}) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/reorderFields`, {
        fromIndex,
        toIndex,
    });
    return camelcaseKeys(data);
}

export async function deleteContentTemplateField({
    contentTemplateId,
    fieldId,
}: {
    contentTemplateId: string;
    fieldId: string;
}) {
    const { data } = await apiClient.delete<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields/${fieldId}`);
    return camelcaseKeys(data);
}
