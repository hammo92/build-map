import { ulid } from 'ulid'
import { ContentField } from '../types'
/*import {
    ContentTemplateHistory,
    ContentTemplate as ContentTemplateModel,
} from "../../../lib/contentTemplate/data/contentTemplate.model";*/
import structuredClone from '@ungap/structured-clone'
import { Field, FieldType, Property } from '../../../field/data/field.model'
import { ContentTemplate } from '../../../../lib/contentTemplate/data/contentTemplate.model'
import { Content } from '../../../../lib/content/data/content.model'
import { getContentTemplateById } from '../../../../lib/contentTemplate/data'
import dayjs from 'dayjs'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'
import { CleanedCamel } from '../../../../type-helpers'
export function fieldBaseValues({
    userId,
    date,
}: {
    userId: string
    date: string
}): Partial<ContentField> {
    return {
        id: ulid(),
        active: true,
        createdBy: userId,
        createdTime: date,
        lastEditedTime: date,
        lastEditedBy: userId,
    }
}

export function fieldFromTemplateProperty<T extends FieldType>({
    property,
    type,
    userId,
    overrides,
    parent,
}: {
    property: Property<T>
    type: T
    userId: string
    date: string
    overrides?: Partial<Field>
    parent: string
}): Field<T> {
    const {
        id,
        createdBy,
        createdTime,
        lastEditedBy,
        lastEditedTime,
        active,
        archived,
        ...rest
    } = property

    return new Field<T>({
        ...rest,
        type,
        ...(property.defaultValue && {
            value: property?.defaultValue,
            defaultValue: property.defaultValue,
        }),
        templatePropertyId: property.id,
        parent,
        userId,
        // give title field a predefined id
        ...(property.type === 'title' && { id: `title_${parent}` }),
        ...overrides,
    })
}

export function getContentTitle({
    content,
    contentFields,
    contentTemplate,
}: {
    content: Content
    contentFields: Field[]
    contentTemplate: ContentTemplate
}) {
    const titleField = contentFields.find((field) => field.type === 'title')
    if (
        !titleField ||
        !titleField.value ||
        (!titleField.stringTemplate && titleField.useTemplate)
    ) {
        return `${contentTemplate.name}:${
            content.status === 'draft' ? 'draft:' : ''
        }${content.entryNumber}`
    }
    if (!titleField.useTemplate) {
        return titleField.value
    }
    return titleField
        .value!.map((element: TitleElementProps) =>
            element.variant === 'entryNumber' && content.status === 'draft'
                ? `draft-${content.entryNumber}`
                : element.variant === 'entryNumber' &&
                  content.status !== 'draft'
                ? content.entryNumber
                : element.value
        )
        .join('')
}

export function populateTitleValue({
    content,
    property,
}: {
    content: Content
    property: CleanedCamel<Property>
}) {
    if (property.useTemplate && property.stringTemplate) {
        return property.stringTemplate.map((element) => {
            switch (element.variant) {
                case 'createdTime':
                    return {
                        ...element,
                        value: dayjs(content.createdTime).format('H:m:s'),
                    }
                case 'createdDate':
                    return {
                        ...element,
                        value: dayjs(content.createdTime).format('D/YY/MMMM'),
                    }
                case 'entryNumber':
                    return {
                        ...element,
                        value: `${content.status === 'draft' ? 'draft-' : ''}${
                            content.entryNumber
                        }`,
                    }
                default:
                    return element
            }
        })
    }
    return null
}

export function generateFields({
    properties,
    content,
    userId,
}: {
    properties: Property[]
    content: Content
    userId: string
}) {
    return properties
        .filter((property) => property.active !== false && !property.archived)
        .map((property) => {
            const field = fieldFromTemplateProperty({
                property,
                type: property.type,
                userId,
                date: new Date().toISOString(),
                parent: content.id,
            })
            if (property.type === 'title') {
                field.value = populateTitleValue({ content, property }) ?? ''
            }
            return field
        })
}

export function duplicateField({
    field,
    userId,
    keepValue,
}: {
    field: ContentField
    userId: string
    keepValue?: boolean
}) {
    const copy = structuredClone(field)
    const date = new Date().toISOString()
    copy.id = ulid()
    copy.createdBy = userId
    copy.createdTime = date
    copy.lastEditedTime = date
    copy.lastEditedBy = userId
    if (!keepValue && !copy.defaultValue) {
        delete copy.value
    }
    if (copy.defaultValue) {
        copy.value = copy.defaultValue
    }
    return copy
}
