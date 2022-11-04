import { Content, ContentStatus } from '@lib/content/data/content.model'
import { ContentField } from '@lib/content/data/types'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Field } from '@lib/field/data/field.model'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedCamel, CleanedSnake } from 'type-helpers'

export async function createContent({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string
    projectId: string
}) {
    const { data } = await apiClient.post<{
        newContent: CleanedSnake<Content>
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/content`, {
        contentTemplateId,
        projectId,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function getContent(contentId: string) {
    const { data } = await apiClient.get<{
        content: CleanedSnake<Content>
        contentTemplate: CleanedSnake<ContentTemplate>
        contentFields: CleanedCamel<Field>[]
    }>(`/content/${contentId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function deleteContent(contentId: string) {
    console.log('contentId', contentId)
    const { data } = await apiClient.delete<{
        content: CleanedSnake<Content>
    }>(`/content/${contentId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function getContentOfTemplate({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string
    projectId: string
}) {
    const { data } = await apiClient.get(
        `/projects/${projectId}/contentTemplates/${contentTemplateId}`
    )
    return camelcaseKeys(data, { deep: true }) as {
        content: CleanedCamel<Content>[]
        contentTemplate: CleanedCamel<ContentTemplate>
    }
}

export async function updateContentStatus({
    contentId,
    status,
}: {
    contentId: string
    status: ContentStatus
}) {
    const { data } = await apiClient.patch<{
        Content: CleanedSnake<Content>
    }>(`/content/${contentId}/status`, {
        status,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function updateContentValues({
    contentId,
    values,
}: {
    contentId: string
    values: { [fieldId: string]: ContentField['value'] }
}) {
    const { data } = await apiClient.patch<{
        Content: CleanedSnake<Content>
    }>(`/content/${contentId}/values`, {
        values,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function updateContentFields({
    contentId,
    updates,
    deletions,
}: {
    contentId: string
    updates?: ContentField[]
    deletions?: ContentField[]
}) {
    const { data } = await apiClient.patch<{
        Content: CleanedSnake<Content>
    }>(`/content/${contentId}/fields`, {
        updates,
        deletions,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function repeatGroup({
    contentId,
    groupId,
}: {
    contentId: string
    groupId: string
}) {
    const { data } = await apiClient.post<{
        content: CleanedSnake<Content>
        newFields: CleanedSnake<Field>[]
    }>(`/content/${contentId}/groups/${groupId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function deleteGroup({
    contentId,
    groupId,
}: {
    contentId: string
    groupId: string
}) {
    const { data } = await apiClient.delete<{
        Content: CleanedSnake<Content>
    }>(`/content/${contentId}/groups/${groupId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function updateContentFromTemplate({
    contentId,
}: {
    contentId: string
}) {
    const { data } = await apiClient.patch<{
        Content: CleanedSnake<Content>
    }>(`/content/${contentId}/patchFromTemplate`)
    return camelcaseKeys(data, { deep: true })
}
