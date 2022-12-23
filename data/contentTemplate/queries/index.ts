import { Icon } from '@components/ui/iconPicker/types'
import { UpdatePropertiesProps } from '@lib/contentTemplate/data'
import {
    ContentTemplate,
    ContentTemplateTitle,
} from '@lib/contentTemplate/data/contentTemplate.model'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedCamel, CleanedSnake } from 'type-helpers'

export type ContentTemplateResponse = {
    contentTemplate: CleanedCamel<ContentTemplate>
}

export async function createContentTemplate({
    name,
    organisationId,
    icon,
    templateType,
    properties,
    propertyGroups,
    status,
}: {
    name: string
    organisationId: string
    icon: Icon
    templateType: ContentTemplate['templateType']
    properties?: ContentTemplate['properties']
    propertyGroups?: ContentTemplate['propertyGroups']
    status?: ContentTemplate['status']
}) {
    const { data } = await apiClient.post<{
        newContentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/contentTemplates`, {
        name,
        organisationId,
        icon,
        templateType,
        properties,
        propertyGroups,
        status,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function getContentTemplate(contentTemplateId: string) {
    const { data } = await apiClient.get<{
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/contentTemplates/${contentTemplateId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function updateContentTemplate({
    contentTemplateId,
    name,
    status,
    icon,
    title,
}: {
    contentTemplateId: string
    name?: string
    status?: 'draft' | 'published' | 'archived'
    icon?: Icon
    title?: ContentTemplateTitle
}) {
    const { data } = await apiClient.patch<{
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/contentTemplates/${contentTemplateId}`, {
        name,
        status,
        icon,
        title,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function updateContentTemplateProperties({
    contentTemplateId,
    ...rest
}: UpdatePropertiesProps) {
    const { data } = await apiClient.post<{
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/contentTemplates/${contentTemplateId}/properties`, {
        ...rest,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function deleteContentTemplate(contentTemplateId: string) {
    const { data } = await apiClient.delete<{
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`/api/proxy/contentTemplates/${contentTemplateId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function getOrganisationContentTemplates(organisationId: string) {
    const { data } = await apiClient.get(
        `/api/proxy/organisations/${organisationId}/contentTemplates`
    )
    return camelcaseKeys(data, { deep: true }) as {
        contentTemplates: CleanedCamel<ContentTemplate>[]
    }
}

export async function getProjectContentTemplates(projectId: string) {
    const { data } = await apiClient.get(
        `/api/proxy/projects/${projectId}/contentTemplates`
    )
    return camelcaseKeys(data, { deep: true }) as {
        contentTemplates: CleanedCamel<ContentTemplate>[]
    }
}
