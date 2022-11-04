import { TreeData, TreeItem } from '@atlaskit/tree'
import { Property, PropertyGroup } from '@lib/field/data/field.model'
import { CleanedCamel } from 'type-helpers'
import { PropertyListProps } from '../propertyList'

export const generatePlaceholder = (id: string, parent: string | number) => ({
    id,
    children: [],
    hasChildren: false,
    isChildrenLoading: false,

    data: {
        title: 'placeholder',
        isPlaceholder: true,
        parent: parent,
    },
})

export const transformToTree = ({
    propertyGroups,
    properties,
    collapsed,
}: {
    propertyGroups: PropertyListProps['propertyGroups']
    properties: PropertyListProps['properties']
    collapsed: Record<string, boolean>
}): TreeData => {
    let placeholders: TreeItem[] = []
    const addPlaceholder = (groupId: number | string) => {
        const placeholder = generatePlaceholder(
            `placeholder-${placeholders.length}`,
            groupId
        )
        placeholders.push(placeholder)
        return placeholder.id
    }

    /** can be either array or object */
    const groupArray = Array.isArray(propertyGroups)
        ? propertyGroups
        : Object.values(propertyGroups)
    const propertyArray = Array.isArray(properties)
        ? properties
        : Object.values(properties)

    const groupTreeItems = groupArray.reduce(
        (acc, { id, children, name, repeatable }) => {
            acc[id] = {
                id,
                children: children.length ? children : [addPlaceholder(id)],
                hasChildren: true,
                isChildrenLoading: false,
                isExpanded: !collapsed[id],
                data: {
                    name,
                    repeatable,
                    type: 'group',
                    //templateId: template.id,0
                },
            }
            return acc
        },
        {} as Record<string, TreeItem>
    )

    const propertyTreeItems = propertyArray.reduce<Record<string, TreeItem>>(
        (acc, field) => {
            acc[field.id] = {
                id: field.id,
                children: [],
                hasChildren: false,
                isExpanded: false,
                isChildrenLoading: false,
                data: {
                    ...field,
                },
            }
            return acc
        },
        {} as Record<string, TreeItem>
    )

    const placeHolders = placeholders.reduce(
        (acc, placeholder) => ({
            ...acc,
            [placeholder.id]: placeholder,
        }),
        {}
    )

    return {
        rootId: '1',
        items: { ...groupTreeItems, ...propertyTreeItems, ...placeHolders },
    }
}

export const transformFromTree = (treeData: TreeData) => {
    const placeholders = Object.values(treeData.items).reduce<
        (string | number)[]
    >((acc, item) => {
        if (item.data.isPlaceholder) {
            acc.push(item.id)
        }
        return acc
    }, [])
    return (
        Object.values(treeData.items)
            // remove any placeholder values
            .filter(({ data }) => !data.isPlaceholder)
            .reduce<PropertyGroup[]>((acc, item) => {
                if (item.data.type === 'group' || item.hasChildren) {
                    acc.push({
                        children: item.children.filter(
                            (id) => !placeholders.includes(id)
                        ),
                        id: item.id,
                        name: item.data.name,
                        repeatable: item.data.repeatable,
                        type: 'propertyGroup',
                    })
                }
                return acc
            }, [])
    )
}
