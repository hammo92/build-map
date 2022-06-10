import { Content } from "@lib/content/data/content.model";
import { ContentType } from "@lib/contentType/data/contentType.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedCamel, CleanedSnake } from "type-helpers";

export async function createContent({
    contentTypeId,
    projectId,
}: {
    contentTypeId: string;
    projectId: string;
}) {
    const { data } = await apiClient.post<{
        newContent: CleanedSnake<Content>;
        contentType: CleanedSnake<ContentType>;
    }>(`/content`, {
        contentTypeId,
        projectId,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function getContent(contentId: string) {
    const { data } = await apiClient.get<{
        content: CleanedSnake<Content>;
        contentType: CleanedSnake<ContentType>;
    }>(`/content/${contentId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getProjectContentOfType({
    contentTypeId,
    projectId,
}: {
    contentTypeId: string;
    projectId: string;
}) {
    const { data } = await apiClient.get(
        `/projects/${projectId}/contentTypes/${contentTypeId}`
    );
    return camelcaseKeys(data, { deep: true }) as {
        content: CleanedCamel<Content>[];
        contentType: CleanedCamel<ContentType>;
    };
}
