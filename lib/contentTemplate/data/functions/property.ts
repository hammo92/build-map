import { FieldType, Property } from '../../../../lib/field/data/field.model'
import { ulid } from 'ulid'
import { updateRelatedProperty } from '../../../../lib/contentTemplate/data/functions/relation'
import { UNIQUE_FIELDS } from '../../../../components/property/property-type/type-select/options'
import { Required } from 'utility-types'
import fastDeepEqual from 'fast-deep-equal'

export const createProperty = async <T extends FieldType>({
    type,
    name,
    userId,
    parent,
    templateId,
    ...rest
}: Required<Partial<Property<T>>, 'name' | 'type'> & {
    templateId: string
    userId: string
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
        parent: parent ?? '1',
        ...rest,
        type,
        name,
    }

    // Create or update related property
    if (type === 'relation') {
        const relatedProperty = await updateRelatedProperty({
            property: property as Property<'relation'>,
            userId,
        })
        // If related property exists, update property with related property details //
        if (relatedProperty)
            (property as Property<'relation'>).reciprocalPropertyId =
                relatedProperty.id
    }

    if (UNIQUE_FIELDS.includes(type)) {
        property.unique = true
    }

    return property as Property<T>
}

export const updateProperty = async <T extends FieldType>({
    previousProperty,
    property,
    type,
    userId,
}: {
    previousProperty: Property<T>
    property: Partial<Property<T>>
    type: T
    userId: string
}): Promise<Property<T>> => {
    const updatedProperty = {
        ...previousProperty,
        ...property,
    }
    const isChanged = !fastDeepEqual(previousProperty, updatedProperty)
    if (type === 'relation') {
        await updateRelatedProperty({
            property: updatedProperty as Property<'relation'>,
            userId,
        })
    }
    return updatedProperty
}
