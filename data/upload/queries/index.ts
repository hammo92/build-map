import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedSnake } from 'type-helpers'

export async function uploadFiles({ files }: { files: File[] }) {
    const { data } = await apiClient.post<{
        newContent: CleanedSnake<Content>
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/content`, {
        contentTemplateId,
        projectId,
    })
    return camelcaseKeys(data, { deep: true })
}
