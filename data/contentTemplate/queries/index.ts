import { Icon } from "@components/ui/iconPicker/types";
import { FieldGroup } from "@lib/content/data/content.model";
import {
    CreatePropertyGroupProps,
    ReorderPropertyGroupsProps,
    UpdatePropertyGroupProps,
} from "@lib/contentTemplate/data";
import {
    ContentTemplate,
    ContentTemplateTitle,
    PropertyGroup,
} from "@lib/contentTemplate/data/contentTemplate.model";
import { FieldTypes, Property } from "@lib/field/data/field.model";
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
    templateType,
}: {
    name: string;
    organisationId: string;
    icon: Icon;
    templateType: ContentTemplate["templateType"];
}) {
    const { data } = await apiClient.post<{
        newContentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates`, {
        name,
        organisationId,
        icon,
        templateType,
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
    icon?: Icon;
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
    propertyDetails,
    groupId,
    type,
    name,
}: {
    contentTemplateId: string;
    propertyDetails: Partial<Omit<Property, "name" | "type">>;
    groupId?: string;
    type: FieldTypes;
    name: string;
}) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/fields`, {
        propertyDetails,
        groupId,
        name,
        type,
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

export async function createPropertyGroup({
    contentTemplateId,
    name,
    parentId,
}: Omit<CreatePropertyGroupProps, "userId">) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/propertyGroups`, {
        name,
        parentId,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function reorderPropertyGroups({
    contentTemplateId,
    source,
    destination,
}: Omit<ReorderPropertyGroupsProps, "userId">) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/propertyGroups`, {
        source,
        destination,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function updatePropertyGroup({
    contentTemplateId,
    propertyGroupId,
    repeatable,
    name,
}: Omit<UpdatePropertyGroupProps, "userId">) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/propertyGroup/${propertyGroupId}`, {
        repeatable,
        name,
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

export async function deletePropertyGroup({
    contentTemplateId,
    groupId,
    deleteContents,
}: {
    contentTemplateId: string;
    groupId: string;
    deleteContents: boolean;
}) {
    const { data } = await apiClient.delete<{
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/contentTemplates/${contentTemplateId}/propertyGroup/${groupId}-${deleteContents}`);
    return camelcaseKeys(data, { deep: true });
}
