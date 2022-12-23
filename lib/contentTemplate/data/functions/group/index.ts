import { PropertyGroup } from '../../../../field/data/field.model'
import { ulid } from 'ulid'
import { Required } from 'utility-types'

export const createGroup = ({
    name,
    parent,
    repeatable,
    children,
    id,
}: Required<Partial<PropertyGroup>, 'name' | 'type'>) => ({
    id: id ?? ulid(),
    children: children ?? [],
    hasChildren: true,
    repeatable: repeatable ?? false,
    name: name,
    type: 'propertyGroup',
    parent: parent ?? '1',
})
