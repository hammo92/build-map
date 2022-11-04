import { Property } from '@lib/field/data/field.model'
import structuredClone from '@ungap/structured-clone'
import pluralize from 'pluralize'
import { indexBy } from 'serverless-cloud-data-utils'
import { ulid } from 'ulid'
import { createProperty, updateProperties } from '..'
import { ContentTemplate, ContentTemplateId } from '../contentTemplate.model'
import invariant from 'tiny-invariant'

export const findRelatedProperty = async (property: Property) => {
    const [relatedTemplate] = await indexBy(ContentTemplateId)
        .exact(property.relatedTo)
        .get(ContentTemplate)

    invariant(relatedTemplate, 'Related template not found')

    const relatedPropertyIndex = relatedTemplate.properties.findIndex(
        ({ id }) => {
            return id === property.reciprocalPropertyId
        }
    )

    const relatedProperty = relatedTemplate.properties[relatedPropertyIndex]

    return { relatedProperty, relatedPropertyIndex, relatedTemplate }
}

export const createRelatedProperty = async ({
    property,
    userId,
}: {
    property: Property<'relation'>
    userId: string
}) => {
    const { reciprocalPropertyName, relatedTo } = property

    invariant(relatedTo, 'No relation found')

    const { relatedProperty, relatedTemplate } = await findRelatedProperty(
        property
    )

    if (!relatedProperty && relatedTemplate) {
        // create new property
        const relation = await createProperty({
            type: 'relation',
            name: reciprocalPropertyName ?? pluralize(property.name),
            userId,
            templateId: relatedTemplate.id,
            propertyDetails: {
                reciprocalPropertyId: property.id,
                isReciprocal: true,
                reciprocalPropertyName: property.name,
                parent: '1',
                relatedTo: property.templateId,
                id: ulid(),
            },
        })

        relatedTemplate.properties.push(relation)
        relatedTemplate.propertyGroups
            .find(({ id }) => id === '1')
            ?.children.push(relation.id)

        // save property on linked template
        await relatedTemplate.save()

        return relation
    }
    return relatedProperty
}

export const deleteRelatedProperty = async ({
    property,
}: {
    property: Property
}) => {
    const { relatedProperty, relatedTemplate } = await findRelatedProperty(
        property
    )

    if (relatedProperty && relatedTemplate) {
        /** Find and remove from group **/
        const parentGroup = relatedTemplate.propertyGroups.find(
            ({ id }) => id === relatedProperty.parent
        )
        if (parentGroup) {
            parentGroup.children = parentGroup.children.filter(
                (id) => id !== relatedProperty.id
            )
        }

        /** Remove from template **/
        relatedTemplate.properties = relatedTemplate.properties.filter(
            ({ id }) => id !== relatedProperty.id
        )

        await relatedTemplate.save()
        delete property.reciprocalPropertyId

        return property
    }
}

export const updateRelatedProperty = async ({
    property,
    userId,
}: {
    property: Property<'relation'>
    userId: string
}) => {
    /** No action needed **/
    if (!property.isReciprocal && !property.reciprocalPropertyId)
        return property

    /** Handle reciprocal changed to true */
    if (property.isReciprocal && !property.reciprocalPropertyId) {
        const relation = await createRelatedProperty({ property, userId })
        property.reciprocalPropertyId = relation?.id
        return property
    }

    /** Handle reciprocal changed to false */
    if (!property.isReciprocal && property.reciprocalPropertyId) {
        return await deleteRelatedProperty({ property })
    }

    /** handle property updates **/
    const { relatedProperty, relatedTemplate, relatedPropertyIndex } =
        await findRelatedProperty(property)

    if (relatedProperty && relatedTemplate) {
        const clone = structuredClone(relatedProperty)
        if (property.name !== clone.reciprocalPropertyName) {
            clone.reciprocalPropertyName = property.name
        }
        if (
            property.reciprocalPropertyName &&
            property.reciprocalPropertyName !== clone.name
        ) {
            clone.name = property.reciprocalPropertyName
        }

        relatedTemplate.properties[relatedPropertyIndex] = clone
        await relatedTemplate.save()
        return property
    }
}
