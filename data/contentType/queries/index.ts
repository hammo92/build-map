import {
    ContentType,
    ContentTypeField,
    ContentTypeIcon,
} from "@lib/contentType/data/contentType.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { json } from "stream/consumers";
import { CleanedCamel, CleanedSnake, ModelRequired } from "type-helpers";

export type ContentTypeResponse = {
    contentType: CleanedCamel<ContentType>;
};

export async function createContentType({
    name,
    organisationId,
    icon,
}: {
    name: string;
    organisationId: string;
    icon: ContentTypeIcon;
}) {
    const { data } = await apiClient.post<{
        newContentType: CleanedSnake<ContentType>;
    }>(`/contentTypes`, {
        name,
        organisationId,
        icon,
    });
    return camelcaseKeys(data);
}

export async function getContentType(contentTypeId: string) {
    const { data } = await apiClient.get<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function updateContentType({
    contentTypeId,
    name,
    status,
    icon,
}: {
    contentTypeId: string;
    name?: string;
    status?: "draft" | "published";
    icon?: ContentTypeIcon;
}) {
    const { data } = await apiClient.patch<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}`, {
        name,
        status,
        icon,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function deleteContentType(contentTypeId: string) {
    const { data } = await apiClient.delete<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getOrganisationContentTypes(organisationId: string) {
    const { data } = await apiClient.get(
        `/organisations/${organisationId}/contentTypes`
    );
    return camelcaseKeys(data, { deep: true }) as {
        contentTypes: CleanedCamel<ContentType>[];
    };
}

export async function createContentTypeField({
    contentTypeId,
    fieldDetails,
}: {
    contentTypeId: string;
    fieldDetails: ModelRequired<ContentTypeField, "name" | "type">;
}) {
    const { data } = await apiClient.post<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}/fields`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function updateContentTypeField({
    contentTypeId,
    fieldDetails,
}: {
    contentTypeId: string;
    fieldDetails: ModelRequired<ContentTypeField, "id">;
}) {
    const { data } = await apiClient.patch<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}/fields/${fieldDetails.id}`, {
        fieldDetails,
    });
    return camelcaseKeys(data);
}

export async function reorderContentTypeFields({
    contentTypeId,
    fromIndex,
    toIndex,
}: {
    contentTypeId: string;
    fromIndex: number;
    toIndex: number;
}) {
    const { data } = await apiClient.post<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}/reorderFields`, {
        fromIndex,
        toIndex,
    });
    return camelcaseKeys(data);
}

export async function deleteContentTypeField({
    contentTypeId,
    fieldId,
}: {
    contentTypeId: string;
    fieldId: string;
}) {
    const { data } = await apiClient.delete<{
        contentType: CleanedSnake<ContentType>;
    }>(`/contentTypes/${contentTypeId}/fields/${fieldId}`);
    return camelcaseKeys(data);
}
