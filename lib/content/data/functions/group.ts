import { deleteField, duplicateField } from '../../../../lib/field/data'
import { Field, PropertyGroup } from '../../../../lib/field/data/field.model'
import pluralize from 'pluralize'
import { objectify } from 'radash'
import { ulid } from 'ulid'
import { objArrayToHashmap } from '../../../../utils/arrayModify'
import { Content, FieldGroup } from '../content.model'
import invariant from 'tiny-invariant'
import { getContentById } from '../../../../lib/content/data'
import { WithUser } from '@lib/types/types'

// restructure repeatable group to nest inside a parent
export function processGroup(group: PropertyGroup): FieldGroup[] {
    if (group.repeatable) {
        const fieldGroup = {
            ...group,
            repeatable: false,
            name: `${group.name}`,
            id: ulid(),
        } as FieldGroup
        const parentGroup = {
            ...group,
            children: [fieldGroup.id],
            name: pluralize(group.name),
        } as FieldGroup
        fieldGroup.parent = `${parentGroup.id!}`
        return [parentGroup, fieldGroup]
    }
    return [group as FieldGroup]
}

export const generateFieldGroups = ({
    fields,
    propertyGroups,
}: {
    fields: Field[]
    propertyGroups: PropertyGroup[]
}): FieldGroup[] => {
    const fieldMap = objectify(fields, (t) => t.templatePropertyId!)
    const fieldGroups = propertyGroups.map((propertyGroup) => {
        // replace templateFieldId with field id
        propertyGroup.children = propertyGroup.children.map((id) => {
            // if field exists return id of created field
            if (fieldMap[id]) {
                return fieldMap[id].id
            }
            // id is for group so return id
            return id
        })

        return processGroup(propertyGroup)
    })
    return fieldGroups.flat()
}

export type duplicateGroupProps = {
    content: Content
    fields: Field[]
    groupId: string
    keepValues?: boolean
}

export async function duplicateGroup({
    content,
    fields,
    groupId,
    userId,
    keepValues,
}: WithUser<duplicateGroupProps>) {
    const groupMap = objectify(content.fieldGroups, (c) => c.id)
    const fieldMap = objectify(fields, (f) => f.id)

    // repeatable groups have an added parent, find this parent group
    const parentGroup = groupMap[`${groupId}`]
    if (!parentGroup) throw new Error('no group found')
    if (!parentGroup.repeatable) throw new Error('Group not repeatable')

    const nestedFields: Field[] = []
    const nestedGroups: FieldGroup[] = []

    // get first child, used as structure for new group
    const groupTemplate = groupMap[parentGroup.children[0]]

    const clone = async (group: FieldGroup) => {
        const copy: FieldGroup = { ...group, id: ulid(), children: [] }
        const processChild = async (id: string | number) => {
            if (fieldMap[id]) {
                const duplicate = await duplicateField({
                    fieldId: `${id}`,
                    userId,
                    keepValue: keepValues,
                    shouldSave: true,
                })
                duplicate.parent = `${copy.id}`
                nestedFields.push(duplicate)
                copy.children.push(duplicate.id)
            }
            if (groupMap[id]) {
                const groupCopy = await clone(groupMap[id])
                groupCopy.parent = `${copy.id}`
                nestedGroups.push(groupCopy)
                copy.children.push(groupCopy.id)
            }
        }
        // if repeatable copy only the first child instance
        if (group.repeatable) await processChild(group.children[0])
        else {
            await Promise.all(group.children.map(processChild))
        }

        return copy
    }

    const newGroup = await clone(groupTemplate)
    return { newGroup, nestedFields, nestedGroups }
}

export async function deleteGroup({
    contentId,
    groupId,
    userId,
}: {
    contentId: string
    groupId: string
    userId: string
}) {
    const { content, contentFields } = await getContentById(contentId)

    const groupMap = objectify(content.fieldGroups, (c) => c.id)
    const fieldMap = objectify(contentFields, (f) => f.id)

    console.log('👉 content.fieldGroups >>', content.fieldGroups)

    const group = groupMap[groupId]
    invariant(group, 'Group not found')

    console.log('👉 group >>', group)

    const groupParent = group.parent && groupMap[group.parent]
    invariant(groupParent, 'Group parent not found')

    if (groupParent.children.length! <= 1)
        throw new Error('Cannot delete last group')

    /** remove from parent **/
    groupMap[groupParent.id].children = groupParent.children.filter(
        (id) => id !== groupId
    )

    /** recursively delete fields **/
    const handleDelete = async (id: string | number) => {
        if (fieldMap[id]) {
            delete fieldMap[id]
            await deleteField({ fieldId: `${id}`, userId })
        }
        if (groupMap[id]) {
            await Promise.all(groupMap[id].children.map(handleDelete))
            delete groupMap[id]
        }
    }

    await handleDelete(groupId)

    content.fields = Object.keys(fieldMap)
    content.fieldGroups = Object.values(groupMap)

    console.log('👉 content.fields >>', content.fields)
    console.log('👉 content.groups >>', content.fieldGroups)

    await content.save()

    return content
}
