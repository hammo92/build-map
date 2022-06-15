import { Content } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedCamel, CleanedSnake } from "type-helpers";

export async function createContent({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string;
    projectId: string;
}) {
    const { data } = await apiClient.post<{
        newContent: CleanedSnake<Content>;
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/content`, {
        contentTemplateId,
        projectId,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function getContent(contentId: string) {
    const { data } = await apiClient.get<{
        content: CleanedSnake<Content>;
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`/content/${contentId}`);
    return camelcaseKeys(data, { deep: true });
}

export async function getProjectContentOfType({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string;
    projectId: string;
}) {
    const { data } = await apiClient.get(
        `/projects/${projectId}/contentTemplates/${contentTemplateId}`
    );
    return camelcaseKeys(data, { deep: true }) as {
        content: CleanedCamel<Content>[];
        contentTemplate: CleanedCamel<ContentTemplate>;
    };
}
