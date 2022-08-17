import { IconPickerIcon } from "@components/ui/iconPicker/types";
import {
    ContentTemplate,
    ContentTemplateTitle,
} from "@lib/contentTemplate/data/contentTemplate.model";
import { Property } from "@lib/contentTemplate/data/types";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
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
    icon: IconPickerIcon;
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
    return camelcaseKeys(data, { deep: true });
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
    title,
}: {
    contentTemplateId: string;
    name?: string;
    status?: "draft" | "published";
    icon?: IconPickerIcon;
    title?: ContentTemplateTitle;
}) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}`, {
        name,
        status,
        icon,
        title,
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
    const { data } = await apiClient.get(`/organisations/${organisationId}/contentTemplates`);
    return camelcaseKeys(data, { deep: true }) as {
        contentTemplates: CleanedCamel<ContentTemplate>[];
    };
}

export async function getProjectContentTemplates(projectId: string) {
    const { data } = await apiClient.get(`/projects/${projectId}/contentTemplates`);
    return camelcaseKeys(data, { deep: true }) as {
        contentTemplates: CleanedCamel<ContentTemplate>[];
    };
}

export async function createProperty({
    contentTemplateId,
    fieldProperties,
}: {
    contentTemplateId: string;
    fieldProperties: CleanedCamel<Property>;
}) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields`, {
        fieldProperties,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function updateProperty({
    contentTemplateId,
    fieldProperties,
}: {
    contentTemplateId: string;
    fieldProperties: ModelRequired<Property, "id">;
}) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields/${fieldProperties.id}`, {
        fieldProperties,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function reorderProperties({
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
    return camelcaseKeys(data, { deep: true });
}

export async function deleteProperty({
    contentTemplateId,
    fieldId,
}: {
    contentTemplateId: string;
    fieldId: string;
}) {
    const { data } = await apiClient.delete<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields/${fieldId}`);
    return camelcaseKeys(data, { deep: true });
}
