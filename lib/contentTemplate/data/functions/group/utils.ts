import { Property, PropertyGroup } from '@lib/field/data/field.model'

// recursively check property parents for repeatable
export const parentIsRepeatable = ({
    groupId,
    groupMap,
}: {
    groupId: string | number
    groupMap: Record<string, PropertyGroup>
}) => {
    const group = groupMap[groupId]
    if (group.parent === '1' || !group.parent) return false
    const parent = groupMap[group.parent]
    if (parent.repeatable) return true
    parentIsRepeatable({ groupId: parent.id, groupMap })
}

// recursive check for unique property
const checkForUnique = ({
    itemId,
    groupMap,
    propertyMap,
}: {
    itemId: string | number
    groupMap: Record<string, PropertyGroup>
    propertyMap: Record<string, Property>
}): boolean | undefined => {
    if (groupMap[itemId]) {
        const group = groupMap[itemId]
        return group.children.some((id) =>
            checkForUnique({ itemId: id, groupMap, propertyMap })
        )
    }
    return propertyMap[itemId]?.unique
}
