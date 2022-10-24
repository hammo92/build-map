import { CleanedCamel } from '../../../type-helpers'
import { Content } from '@lib/content/data/content.model'
import { Field, Property, PropertyGroup } from '@lib/field/data/field.model'
import { objArrayToHashmap } from '../../../utils/arrayModify'
import { FieldGroup } from '../field-list/list-grouped'

export const groupFields = ({
    propertyGroups,
    fields,
}: {
    propertyGroups: PropertyGroup[]
    fields: CleanedCamel<Field>[]
}): FieldGroup => {
    const groupMap = objArrayToHashmap(propertyGroups, 'id')
    const fieldMap = objArrayToHashmap(fields, 'id')
    const combined = { ...groupMap, ...fieldMap }

    // root group always exists with id "1"
    const root = groupMap['1']!

    const getChildren = (
        item: CleanedCamel<Field> | PropertyGroup,
        level = 0,
        path: string[] = []
    ): FieldGroup | CleanedCamel<Field> => {
        if (item?.type === 'propertyGroup') {
            const children = item.children.map((id) => {
                const childItem = combined[id]
                return getChildren(childItem, level + 1, [
                    ...path,
                    `${item.id}`,
                ])
            })
            return {
                ...item,
                children,
            }
        }
        return fieldMap[item.id!]
    }

    // root group is always present so return will always be a FieldProps Group
    const fieldGroup = getChildren(root) as FieldGroup
    return fieldGroup
}
