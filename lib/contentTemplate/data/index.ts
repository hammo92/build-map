import { params } from '@serverless/cloud'
import { PartialProperty } from '@state/propertyManager'

import { Oso } from 'oso-cloud'
import { indexBy } from 'serverless-cloud-data-utils'
import { ulid } from 'ulid'
import { Icon } from '../../../components/ui/iconPicker/types'
import {
    FieldType,
    Property,
    PropertyGroup,
} from '../../../lib/field/data/field.model'
import { errorIfUndefined } from '../../utils'
import {
    ContentTemplate,
    ContentTemplateId,
    ContentTemplateOrganisation,
} from './contentTemplate.model'
import {
    deleteRelatedProperty,
    updateRelatedProperty,
} from './functions/relation'
import { UNIQUE_FIELDS } from '../../../components/property/property-type/type-select/options'
import invariant from 'tiny-invariant'

const oso = new Oso('https://cloud.osohq.com', params.OSO_API_KEY)

export const ROOT_GROUP_TEMPLATE = {
    id: '1',
    children: [],
    name: 'root',
    repeatable: false,
    type: 'propertyGroup',
}

//* Create contentTemplate */
export async function createContentTemplate({
    name,
    icon,
    organisationId,
    userId,
    templateType,
    properties,
    propertyGroups,
    status,
}: {
    name: string
    icon: Icon
    organisationId: string
    userId: string
    templateType: ContentTemplate['templateType']
    properties?: Property[]
    propertyGroups?: PropertyGroup[]
    status?: ContentTemplate['status']
}) {
    errorIfUndefined({ name, userId, organisationId, icon, templateType })

    // create contentTemplate //
    const newContentTemplate = new ContentTemplate({ userId })

    // set Content Template details
    newContentTemplate.name = name
    newContentTemplate.icon = icon
    newContentTemplate.status = status || 'draft'
    newContentTemplate.templateType = templateType
    newContentTemplate.organisationId = organisationId
    newContentTemplate.properties = properties || []
    newContentTemplate.propertyGroups = propertyGroups || [
        {
            id: '1',
            children: [],
            name: 'root',
            repeatable: false,
            type: 'propertyGroup',
        },
    ]
    newContentTemplate.draftCounter = 0
    newContentTemplate.publishedCounter = 0

    await newContentTemplate.save()
    return newContentTemplate
}

//* Get contentTemplate by id */
export async function getContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId })
    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate)

    invariant(contentTemplate, "Content Template doesn't exist")
    return contentTemplate
}

//* Get Organisation's contentTemplates */
export async function getOrganisationContentTemplates(organisationId: string) {
    errorIfUndefined({ organisationId })
    return await indexBy(ContentTemplateOrganisation(organisationId)).get(
        ContentTemplate
    )
}

//* Delete contentTemplate by id */
export async function deleteContentTemplateById(contentTemplateId: string) {
    errorIfUndefined({ contentTemplateId })
    // get contentTemplate
    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate)

    errorIfUndefined({ contentTemplate }, 'notFound')

    await contentTemplate!.delete()

    return contentTemplate
}

//* Update contentTemplate */
export async function updateContentTemplate({
    contentTemplateId,
    name,
    status,
    icon,

    userId,
}: {
    contentTemplateId: string
    name?: string
    status?: 'archived' | 'published'
    icon?: Icon

    userId: string
}) {
    errorIfUndefined({ contentTemplateId, userId })
    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate)
    if (!contentTemplate) throw new Error('No content template found')

    if (status) contentTemplate.status = status

    if (name) contentTemplate.name = name

    if (icon) contentTemplate.icon = icon

    await contentTemplate.save()

    return contentTemplate
}

export const createProperty = async <T extends FieldType>({
    type,
    name,
    userId,
    propertyDetails,
    templateId,
}: {
    type: T
    name: string
    userId: string
    propertyDetails: Partial<Omit<Property<T>, 'name' | 'type'>>
    templateId: string
}): Promise<Property<T>> => {
    const date = new Date().toISOString()
    const property = {
        object: 'Property',
        id: ulid(),
        createdTime: date,
        createdBy: userId ?? 'system',
        lastEditedTime: date,
        lastEditedBy: userId ?? 'system',
        archived: false,
        templateId: templateId,
        ...propertyDetails,
        type,
        name,
    }
    if (type === 'relation') {
        const propertyWithRelated = await updateRelatedProperty({
            property: property as Property<'relation'>,
            userId,
        })
        return (propertyWithRelated ?? property) as Property<T>
    }
    if (UNIQUE_FIELDS.includes(type)) {
        property.unique = true
    }
    return property as Property<T>
}

const updateProperty = async <T extends FieldType>({
    property,
    type,
    userId,
}: {
    property: Property<T>
    type: T
    userId: string
}): Promise<Property<T>> => {
    const updatedProperty = {
        ...property,
        lastEditedBy: userId,
        lastEditedTime: new Date().toISOString(),
    }
    if (type === 'relation') {
        await updateRelatedProperty({
            property: updatedProperty as Property<'relation'>,
            userId,
        })
    }
    return updatedProperty
}

export interface UpdatePropertiesProps {
    createdProperties?: Record<string, PartialProperty>
    updatedProperties?: Record<string, Property>
    deletedProperties?: Record<string, PartialProperty>
    contentTemplateId: string
    createdGroups?: Record<string, PropertyGroup>
    updatedGroups?: Record<string, PropertyGroup>
    deletedGroups?: Record<string, PropertyGroup>
}

export async function updateProperties({
    contentTemplateId,
    createdGroups = {},
    createdProperties = {},
    deletedGroups = {},
    deletedProperties = {},
    updatedGroups = {},
    updatedProperties = {},
    userId,
}: UpdatePropertiesProps & {
    userId: string
}) {
    errorIfUndefined({ userId, contentTemplateId })
    const [contentTemplate] = await indexBy(ContentTemplateId)
        .exact(contentTemplateId)
        .get(ContentTemplate)

    if (!contentTemplate) throw new Error('No content template found')

    const newProperties: Promise<Property>[] = Object.values(
        createdProperties
    ).map(({ name, type, ...rest }) => {
        return createProperty({
            name,
            propertyDetails: rest,
            type,
            userId,
            templateId: contentTemplateId,
        })
    })

    const properties = contentTemplate.properties.reduce<Promise<Property>[]>(
        (acc, property) => {
            //remove deleted properties
            if (deletedProperties[property.id]) {
                return acc
            }
            // update properties
            if (updatedProperties[property.id]) {
                acc.push(
                    updateProperty({
                        property: updatedProperties[property.id],
                        type: property.type,
                        userId,
                    })
                )
                return acc
            }
            // return unchanged properties
            acc.push(Promise.resolve(property))
            return acc
        },
        [...newProperties]
    )

    const propertyGroups = [
        ...contentTemplate.propertyGroups,
        ...Object.values(createdGroups),
    ].reduce<PropertyGroup[]>((acc, group) => {
        if (deletedGroups[group.id]) {
            return acc
        }
        let tmpGroup = group
        if (updatedGroups[group.id]) {
            tmpGroup = updatedGroups[group.id]
        }

        if (createdGroups[group.id]) {
            tmpGroup = createdGroups[group.id]
        }

        // ensure no id's for removed items remain
        tmpGroup.children = tmpGroup.children.filter(
            (id) =>
                ![
                    ...Object.keys(deletedProperties),
                    ...Object.keys(deletedGroups),
                ].includes(`${id}`)
        )

        acc.push(tmpGroup)
        return acc
    }, [])

    // find deleted relation properties and remove reciprocal properties
    const deletedRelations = Object.values(deletedProperties).filter(
        ({ reciprocalPropertyId }) => reciprocalPropertyId
    )
    await Promise.all(
        deletedRelations.map(async (property) => {
            await deleteRelatedProperty({
                property: property as Property<'relation'>,
            })
        })
    )

    contentTemplate.properties = await Promise.all(properties)
    contentTemplate.propertyGroups = propertyGroups
    await contentTemplate.save()
    return contentTemplate
}
