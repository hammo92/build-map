/* contentTemplate.model.ts */

import { FieldType, Property, PropertyGroup } from '@lib/field/data/field.model'
import { HistoryEntry } from '@lib/historyEntry/data/historyEntry.model'
import { buildIndex, indexBy, timekey } from 'serverless-cloud-data-utils'
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

interface ContentTemplateProps {
    name: string
    icon: Icon
    organisationId: string
    status: 'draft' | 'archived' | 'published'
    templateType: 'collection' | 'component'
    properties: Property[]
    propertyGroups: PropertyGroup[]
    title: ContentTemplateTitle
}

//model: ContentTemplate */
export class ContentTemplate extends ModelWithHistory<ContentTemplate> {
    object = 'ContentTemplate'
    icon: Icon
    organisationId: string
    status: 'draft' | 'archived' | 'published'
    templateType: 'collection' | 'component' | 'task'
    properties: Property<FieldType>[]
    propertyGroups: PropertyGroup[]
    title: ContentTemplateTitle

    modelKeys() {
        return [
            indexBy(ContentTemplateId).exact(this.id),
            indexBy(ContentTemplateOrganisation(this.organisationId)).exact(
                this.lastEditedTime
            ),
        ]
    }

    async saveWithHistory(
        props: Omit<HistoryEntry, 'id' | 'createdTime'>
    ): Promise<void> {
        const propertyHistoryEntry = new PropertyHistory()
        propertyHistoryEntry.contentTemplateId = this.id
        propertyHistoryEntry.properties = this.properties
        propertyHistoryEntry.propertyGroups = this.propertyGroups
        await propertyHistoryEntry.save()
        super.saveWithHistory({
            ...props,
            linked: { id: propertyHistoryEntry.id, type: 'PropertyHistory' },
        })
    }
}

// To get  propertyHistory by it's ID *//
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
    properties: Property<FieldType>[]
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
