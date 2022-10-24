// recursively check property parents for repeatable
import { PropertyGroup } from '@lib/field/data/field.model'

export const parentIsRepeatable = ({
    parentGroupId,
    groupMap,
}: {
    parentGroupId?: string
    groupMap: Record<string, PropertyGroup>
}) => {
    if (parentGroupId === '1' || !parentGroupId) return false
    const group = groupMap[parentGroupId]
    if (group.repeatable) return true
    parentIsRepeatable({ parentGroupId: group.parent, groupMap })
}
