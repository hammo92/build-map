/* contentTemplate.model.ts */

import { FieldType, Property, PropertyGroup } from '@lib/field/data/field.model'
import { HistoryEntry } from '@lib/historyEntry/data/historyEntry.model'
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from 'serverless-cloud-data-utils'
import { Icon } from '../../../components/ui/iconPicker/types'
import { BaseModel, ModelWithHistory } from '../../models'

export interface ContentTemplateTitle {
    setType: 'manual' | 'auto'
    type: 'contentInfo' | 'contentProperty'
    value: string
}
//* contentTemplate model and indexes //

// To get contentTemplate by it's ID *//
//namespace contentTemplate:${contentTemplateId} */
export const ContentTemplateId = buildIndex({
    namespace: `contentTemplate`,
    label: 'label1',
})

// To get all content templates for an organisation *//
//namespace organisation_${organisationId}:contentTemplates:${lastEditedTime} */
export const ContentTemplateOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:contentTemplates`,
        label: 'label2',
        converter: timekey,
    })

//model: ContentTemplate */
export class ContentTemplate extends BaseModel<ContentTemplate> {
    object = 'ContentTemplate'
    icon: Icon
    organisationId: string
    status: 'draft' | 'archived' | 'published'
    templateType: 'collection' | 'component' | 'task'
    properties: Property[]
    propertyGroups: PropertyGroup[]

    //* counters for content instances created *//
    draftCounter: number
    publishedCounter: number

    modelKeys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(
                this.lastEditedTime
            ),
        ]
    }
}

// To get  propertyHistory by its ID *//
//namespace propertyHistory:${propertyHistoryId} */
export const PropertyHistoryId = buildIndex({
    namespace: `propertyHistory`,
    label: 'label1',
})

// To get all propertyHistory entries for a contentTemplate *//
//namespace contentTemplate_${contentTemplateId}:propertyHistories:${lastEditedTime} */
export const TemplatePropertyHistory = (contentTemplateId: string) =>
    buildIndex({
        namespace: `contentTemplate_${contentTemplateId}:propertyHistories`,
        label: 'label2',
        converter: timekey,
    })

export class PropertyHistory extends BaseModel<PropertyHistory> {
    object = 'PropertyHistory'
    contentTemplateId: string
    properties: Property[]
    propertyGroups: PropertyGroup[]
    modelKeys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.contentTemplateId)).exact(
                this.lastEditedTime
            ),
        ]
    }
}
