//* content model and indexes //

import { PropertyGroup } from '@lib/field/data/field.model'
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from 'serverless-cloud-data-utils'
import { BaseModel, ModelWithHistory } from '../../../lib/models'

export type FieldGroup = PropertyGroup

export type ContentStatus = 'draft' | 'published' | 'archived'

// To get content by it's ID *//
//namespace content:${contentId} */
export const ContentId = buildIndex({ namespace: `content`, label: 'label1' })

// To get a content by templateId, filter by project  *//
//namespace content:template_${templateId}:project_${projectId}:lastEditedTime */
export const ContentTemplate = ({
    templateId,
    projectId,
}: {
    templateId: string
    projectId: string
}) =>
    buildIndex({
        namespace: `content:template_${templateId}:project_${projectId}`,
        label: 'label2',
        converter: timekey,
    })

// To get a content by templateId, filter by project and status  *//
//namespace content:template_${templateId}:project_${projectId}:status_${string}:(createdAt || publishedAt) */
export const ContentStatus = ({
    templateId,
    projectId,
    status,
}: {
    templateId: string
    projectId: string
    status: ContentStatus
}) =>
    buildIndex({
        namespace: `content:template_${templateId}:project_${projectId}:status_${status}`,
        label: 'label3',
        converter: timekey,
    })

//model: Content */
export class Content extends BaseModel<Content> {
    object = 'Content'
    contentTemplateId: string
    projectId: string
    publishTime: string
    status: ContentStatus
    fields: string[]
    fieldGroups: FieldGroup[]
    contentTemplateVersion: string
    title: string
    entryNumber: number

    modelKeys() {
        return [
            indexBy(ContentId).exact(this.id),
            indexBy(
                ContentTemplate({
                    templateId: this.contentTemplateId,
                    projectId: this.projectId,
                })
            ).exact(this.lastEditedTime),
            indexBy(
                ContentStatus({
                    templateId: this.contentTemplateId,
                    projectId: this.projectId,
                    status: this.status,
                })
            ).exact(this.createdTime),
        ]
    }
}
