import {
    ItemId,
    TreeData,
    TreeDestinationPosition,
    TreeSourcePosition,
} from '@atlaskit/tree'
import { transformToTree } from '@components/property/property-list/utils/dataTransform'
import { FieldType, Property, PropertyGroup } from '@lib/field/data/field.model'
import { showNotification } from '@mantine/notifications'
import structuredClone from '@ungap/structured-clone'
import equal from 'fast-deep-equal'
import memoize from 'proxy-memoize'
import { Writable } from 'type-fest'
import { ulid } from 'ulid'
import { Required } from 'utility-types'
import { objArrayToHashmap } from 'utils/arrayModify'
import { proxyWithComputed } from 'valtio/utils'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { CleanedCamel } from '../../type-helpers'
import { objectify } from 'radash'
import { ROOT_GROUP_TEMPLATE } from '@lib/contentTemplate/data'

export type PartialProperty = Required<Partial<Property>, 'type' | 'name'>
interface PropertyManagerProps {
    propertyMap: Record<string, PartialProperty | Property>
    propertyMapInitial: Record<string, PartialProperty | Property>

    propertyGroupMap: Record<string, PropertyGroup>
    propertyGroupMapInitial: Record<string, PropertyGroup>

    createdProperties: Record<string, PartialProperty>
    updatedProperties: Record<string, Property>
    deletedProperties: Record<string, PartialProperty>

    createdGroups: Record<string, PropertyGroup>
    updatedGroups: Record<string, PropertyGroup>
    deletedGroups: Record<string, PropertyGroup>

    collapsed: Record<string, boolean>
    editing: boolean
}

interface PropertyManagerInitialProps {
    propertyMapInitial: Record<string, PartialProperty>
    propertyGroupMapInitial: Record<string, PropertyGroup>
}

const showError = (message: string) => {
    showNotification({
        title: 'Error',
        message,
        color: 'red',
    })
}

const objHasEntries = (obj: Record<any, any>) => !!Object.keys(obj).length

export const propertyManager = proxyWithComputed<
    PropertyManagerProps,
    { tree: TreeData; changed: boolean; emptyGroup: boolean }
>(
    {
        propertyMap: {},
        propertyMapInitial: {},

        propertyGroupMap: {},
        propertyGroupMapInitial: {},

        createdProperties: {},
        updatedProperties: {},
        deletedProperties: {},

        createdGroups: {},
        updatedGroups: {},
        deletedGroups: {},

        collapsed: {},
        editing: true,
    },
    {
        tree: memoize((snap) =>
            transformToTree({
                collapsed: snap.collapsed,
                properties: Object.values(snap.propertyMap) as Writable<
                    Property[]
                >,
                propertyGroups: Object.values(
                    snap.propertyGroupMap
                ) as Writable<PropertyGroup[]>,
            })
        ),
        changed: memoize(
            (snap) =>
                objHasEntries(snap.createdProperties) ||
                objHasEntries(snap.updatedProperties) ||
                objHasEntries(snap.deletedProperties) ||
                objHasEntries(snap.createdGroups) ||
                objHasEntries(snap.updatedGroups) ||
                objHasEntries(snap.deletedGroups)
        ),
        emptyGroup: memoize((snap) =>
            Object.values(snap.propertyGroupMap).some(
                (group) => !group.children.length
            )
        ),
    }
)

export const initiateState = ({
    properties,
    propertyGroups,
}: {
    properties: Property[]
    propertyGroups: PropertyGroup[]
}) => {
    const propertyMap = objArrayToHashmap(properties, 'id')
    const groupMap = objArrayToHashmap(propertyGroups, 'id')

    // need to be deep cloned to avoid children being updated by reference
    propertyManager.propertyMapInitial = structuredClone(propertyMap)
    propertyManager.propertyGroupMapInitial = structuredClone(groupMap)

    propertyManager.propertyMap = propertyMap
    propertyManager.propertyGroupMap = groupMap
}

export const resetState = () => {
    propertyManager.propertyMap = {}
    propertyManager.propertyMapInitial = {}

    propertyManager.propertyGroupMap = {}
    propertyManager.propertyGroupMapInitial = {}

    propertyManager.createdProperties = {}
    propertyManager.updatedProperties = {}
    propertyManager.deletedProperties = {}

    propertyManager.createdGroups = {}
    propertyManager.updatedGroups = {}
    propertyManager.deletedGroups = {}

    propertyManager.collapsed = {}
    propertyManager.editing = true
}

const updateGroup = ({
    groupId,
    newConfig,
}: {
    groupId: string
    newConfig: Partial<PropertyGroup>
}) => {
    const {
        propertyGroupMap,
        updatedGroups,
        propertyGroupMapInitial,
        createdGroups,
    } = propertyManager
    const group = propertyGroupMap[groupId]

    if (!group) {
        showError('Could not update group')
    }

    const updatedGroup = {
        ...group,
        ...newConfig,
    }

    //check if group matches initial state
    if (equal(updatedGroup, propertyGroupMapInitial[groupId])) {
        // if equal removed from updated
        delete updatedGroups[groupId]
    } else if (createdGroups[groupId]) {
        createdGroups[groupId] = updatedGroup
    } else {
        // else add changed group to updated
        updatedGroups[groupId] = updatedGroup
    }

    // update in state either way
    propertyGroupMap[groupId] = updatedGroup
}

const updateProperty = ({
    propertyId,
    newConfig,
}: {
    propertyId: string
    newConfig: Partial<Property>
}) => {
    const {
        propertyMap,
        updatedProperties,
        propertyMapInitial,
        createdProperties,
    } = propertyManager
    const property = propertyMap[propertyId]
    if (!property) {
        showError('Could not update property')
    }
    const updatedProperty = {
        ...property,
        ...newConfig,
    } as Property

    //check if property matches initail state
    if (equal(updatedProperty, propertyMapInitial[propertyId])) {
        // if equal removed from updated
        delete updatedProperties[propertyId]
    } else if (createdProperties[propertyId]) {
        createdProperties[propertyId] = updatedProperty
    } else {
        // else add changed group to updated
        updatedProperties[propertyId] = updatedProperty
    }

    // update in state either way
    propertyMap[propertyId] = updatedProperty
}

export const createProperty = <T extends FieldType>({
    type,
    name,
    parentId = '1',
    ...propertyDetails
}: Partial<Omit<Property<T>, 'name' | 'type'>> & {
    type: T
    name: string
    parentId: string
}) => {
    const { propertyMap, propertyGroupMap, createdProperties } = propertyManager
    const parent = propertyGroupMap[parentId]

    const property = {
        type,
        name,
        id: ulid(),
        parent: parentId,
        ...propertyDetails,
    }
    propertyMap[property.id] = property
    createdProperties[property.id] = property
    updateGroup({
        groupId: parentId,
        newConfig: { children: [...parent.children, property.id] },
    })
    return property
}

export const updatePropertyDetails = ({
    propertyId,
    property,
}: {
    propertyId: string
    property: Property
}) => {
    const { propertyMap } = propertyManager
    if (!propertyMap[propertyId]) {
        showError('Could not update property')
    }
    updateProperty({ propertyId, newConfig: property })
}

export const deleteProperty = (propertyId: string) => {
    const {
        propertyMap,
        propertyGroupMap,
        createdProperties,
        deletedProperties,
        updatedProperties,
    } = propertyManager
    const property = propertyMap[propertyId]
    if (!property) {
        showError("Couldn't delete property")
        return
    }
    const parent = propertyGroupMap[property.parent ?? 1]

    // update parent group
    updateGroup({
        groupId: `${parent.id}`,
        newConfig: {
            children: parent.children.filter((id) => id !== propertyId),
        },
    })

    // if new property remove from created
    if (createdProperties[propertyId]) {
        delete createdProperties[propertyId]
    } else {
        deletedProperties[propertyId] = propertyMap[propertyId]
    }

    // remove property form state
    delete updatedProperties[propertyId]
    delete propertyMap[propertyId]
}

export const createGroup = ({
    name,
    parentId = '1',
    repeatable,
}: {
    name: string
    parentId?: string
    repeatable?: boolean
}) => {
    const { propertyGroupMap, collapsed, createdGroups, updatedGroups } =
        propertyManager
    const id = ulid()
    const newGroup = {
        id,
        children: [],
        hasChildren: true,
        repeatable: repeatable,
        name,
        type: 'propertyGroup',
        parent: parentId,
    } as PropertyGroup

    collapsed[newGroup.id] = false

    propertyGroupMap[id] = newGroup
    createdGroups[id] = newGroup

    // update children on parent
    const parentGroup = propertyGroupMap[parentId]
    updateGroup({
        groupId: parentId,
        newConfig: { children: [...parentGroup.children, newGroup.id] },
    })
    return newGroup
}

/** convert component into group */
export const groupFromComponent = (
    property: Property<'component'>,
    contentTemplate: CleanedCamel<ContentTemplate>
) => {
    const { propertyGroupMap } = propertyManager
    const componentPropertyMap = objectify(
        contentTemplate.properties,
        ({ id }) => id
    )
    const componentGroupMap = objectify(
        contentTemplate.propertyGroups,
        ({ id }) => id
    )
    const propertyParent = propertyGroupMap[property.parent ?? '1']
    const propertyIndex = propertyParent.children.indexOf(property.id)

    const duplicateGroup = (
        groupId: string | number,
        parentId: string,
        name?: string
    ) => {
        const group = componentGroupMap[groupId]
        if (!group) return

        // create copy of group
        const newGroup = createGroup({
            name: name ?? group.name,
            parentId: parentId,
            repeatable: group.repeatable,
        })

        group.children.forEach((childId) => {
            if (componentGroupMap[childId]) {
                return duplicateGroup(childId, `${newGroup.id}`)
            }

            if (componentPropertyMap[childId]) {
                const { id, ...rest } = componentPropertyMap[childId]
                createProperty({
                    parentId: `${newGroup.id}`,
                    ...rest,
                })
            }
        })
    }

    deleteProperty(property.id)
    duplicateGroup('1', `${propertyParent.id}`, property.name)

    /** move new group to same position as component */
    reorderGroup(
        {
            parentId: propertyParent.id ?? '1',
            index: propertyParent.children.length - 1,
        },
        {
            parentId: propertyParent.id ?? '1',
            index: propertyIndex,
        }
    )
}

//* duplicate group */
export const copyGroup = ({
    groupId,
    rebase,
}: {
    groupId: string | number
    rebase?: boolean
}) => {
    const { propertyGroupMap, propertyMap } = propertyManager
    const baseGroup = propertyGroupMap[groupId]
    if (!baseGroup) {
        showNotification({
            title: "Couldn't convert group to component",
            message: 'Group not found on content template',
        })
    }

    const properties: Property[] = []
    const propertyGroups: PropertyGroup[] = []

    const copyGroup = ({
        group,
        isRoot,
        parent,
        rebase,
    }: {
        group: PropertyGroup
        isRoot?: boolean
        parent?: string
        rebase?: boolean
    }) => {
        const { type, name, repeatable, disabled } = group
        const setRoot = isRoot && rebase
        const groupCopy = {
            type,
            disabled,
            name: setRoot ? 'root' : name,
            repeatable: setRoot ? false : repeatable,
            children: [] as string[],
            id: setRoot ? '1' : ulid(),
            ...(!setRoot && { parent }),
        } as PropertyGroup
        group.children.forEach((childId) => {
            if (propertyMap[childId]) {
                const id = ulid()
                properties.push({
                    ...propertyMap[childId],
                    parent: groupCopy.id,
                    id,
                } as Property)
                groupCopy.children.push(id)
            }
            if (propertyGroupMap[childId]) {
                const childGroup = copyGroup({
                    group: propertyGroupMap[childId],
                    isRoot: false,
                    parent: `${groupCopy.id}`,
                    rebase: false,
                })
                groupCopy.children.push(childGroup.id)
            }
        })
        propertyGroups.push(groupCopy as PropertyGroup)
        return groupCopy
    }

    copyGroup({
        group: baseGroup,
        isRoot: true,
        parent: baseGroup.parent,
        rebase,
    })

    return { properties, propertyGroups }
}

export const replaceGroupWithComponent = ({
    groupId,
    componentId,
}: {
    groupId: string
    componentId: string
}) => {
    const { propertyGroupMap } = propertyManager
    const group = propertyGroupMap[groupId]
    if (!group) {
        showError("Couldn't convert group to component")
        return
    }

    // find group's position in parent
    const groupParent = propertyGroupMap[group.parent ?? '1']
    const groupIndex = groupParent.children.findIndex((id) => id === group.id)

    /** remove group **/
    deleteGroup({ groupId, deleteContents: true })

    /** create replacement property */
    const property = createProperty({
        parentId: group.parent ?? '1',
        name: group.name,
        type: 'component',
        componentId: componentId,
        repeatable: group.repeatable,
    })

    /** move replacement property to group's old position**/
    reorderGroup(
        {
            parentId: property.parent ?? '1',
            index: groupParent.children.length - 1,
        },
        {
            parentId: property.parent ?? '1',
            index: groupIndex,
        }
    )
}

export const deleteGroup = ({
    groupId,
    deleteContents = false,
}: {
    groupId: string
    deleteContents?: boolean
}) => {
    const {
        propertyGroupMap,
        propertyMap,
        updatedGroups,
        createdGroups,
        deletedGroups,
    } = propertyManager
    const group = propertyGroupMap[groupId]

    if (!group) {
        showError("Couldn't delete group")
        return
    }

    // remove group from parent
    const parentGroup = propertyGroupMap[group?.parent ?? '1']

    /*updateGroup({
        groupId: group?.parent ?? "1",
        newConfig: { children: [...parentGroup.children.filter((id) => id !== groupId)] },
    });*/

    // move children into parent if keeping contents
    if (!deleteContents) {
        // update parent for all children
        group.children.forEach((id) => {
            if (propertyMap[id]) {
                updateProperty({
                    propertyId: `${id}`,
                    newConfig: { parent: group.parent },
                })
            }
            if (propertyGroupMap[id]) {
                updateGroup({
                    groupId: `${id}`,
                    newConfig: { parent: group.parent },
                })
            }
        })

        updateGroup({
            groupId: `${parentGroup.id}`,
            newConfig: {
                children: [
                    ...parentGroup.children.filter((id) => id !== groupId),
                    ...group.children,
                ],
            },
        })

        // remove group and any update values
        delete propertyGroupMap[group.id]
        delete updatedGroups[group.id]
        if (createdGroups[group.id]) {
            delete createdGroups[group.id]
        } else {
            deletedGroups[group.id] = group
        }
    } else {
        updateGroup({
            groupId: `${parentGroup.id}`,
            newConfig: {
                children: [
                    ...parentGroup.children.filter((id) => id !== groupId),
                ],
            },
        })

        // recursively delete groups and children
        const deleteGroupAndChildren = (propertyGroup: PropertyGroup) => {
            propertyGroup.children.forEach((id) => {
                const property = propertyMap[id]
                if (property) {
                    // remove property and any update values
                    deleteProperty(`${id}`)
                    return
                }
                const group = propertyGroupMap[id]
                if (group) {
                    deleteGroupAndChildren(group)
                }
            })

            // remove group and any update values
            delete propertyGroupMap[propertyGroup.id]
            delete updatedGroups[propertyGroup.id]
            if (createdGroups[propertyGroup.id]) {
                delete createdGroups[propertyGroup.id]
            } else {
                deletedGroups[propertyGroup.id] = propertyGroup
            }
        }

        deleteGroupAndChildren(group)
    }
}

// recursive check for unique property
const checkForUnique = (itemId: string | number): boolean | undefined => {
    const { propertyGroupMap, propertyMap } = propertyManager
    if (propertyGroupMap[itemId]) {
        const group = propertyGroupMap[itemId]
        return group.children.some((id) => checkForUnique(id))
    }
    return propertyMap[itemId]?.unique
}

// recursive check for repeatable group parent
export const checkForRepeatable = (
    groupId: string | number
): boolean | undefined => {
    const { propertyGroupMap } = propertyManager
    const group = propertyGroupMap[groupId]
    if (!group) {
        return
    }
    if (group.repeatable) return true
    if (group.parent && group.parent !== '1') {
        return checkForRepeatable(group.parent)
    }
    return false
}

export const reorderGroup = (
    source: TreeSourcePosition,
    destination?: TreeDestinationPosition
) => {
    const { propertyGroupMap, propertyMap, updatedGroups } = propertyManager
    const sourceGroup = propertyGroupMap[source.parentId]
    const destinationGroup = propertyGroupMap[destination?.parentId ?? '1']
    if (!sourceGroup || !destinationGroup) {
        showError("Couldn't move item")
        return
    }
    const itemId = sourceGroup.children[source.index]

    const uniqueExists = checkForUnique(itemId)
    const repeatableParent = checkForRepeatable(destinationGroup.id)

    // don't allow unique to be moved into repeatable group
    if (repeatableParent && uniqueExists) {
        showError("Can't move unique property into repeatable group")
        return
    }

    // remove from source
    sourceGroup.children.splice(source.index, 1)
    // add to destination
    destinationGroup.children.splice(destination?.index ?? 0, 0, itemId)

    if (destinationGroup.id !== sourceGroup.id) {
        // if moved item is a group
        if (propertyGroupMap[itemId]) {
            const updatedGroup = {
                ...propertyGroupMap[itemId],
                parent: `${destinationGroup.id}`,
            }

            updateGroup({ groupId: `${itemId}`, newConfig: updatedGroup })
        }

        // if moved item is a property
        if (propertyMap[itemId]) {
            const updatedProperty = {
                ...propertyMap[itemId],
                parent: `${destinationGroup.id}`,
            }
            updateProperty({
                propertyId: `${itemId}`,
                newConfig: updatedProperty as Property,
            })
        }

        updatedGroups[sourceGroup.id] = sourceGroup
    }

    updatedGroups[destinationGroup.id] = destinationGroup
}

export const updateGroupDetails = ({
    groupId,
    name,
    repeatable,
}: {
    groupId: string
    name?: string
    repeatable?: boolean
}) => {
    const { propertyGroupMap, updatedGroups, propertyGroupMapInitial } =
        propertyManager
    const group = propertyGroupMap[groupId]

    if (!group) {
        showError("Couldn't update group")
        return
    }

    // don't allow repeatable to be set on group with unique property
    if (repeatable) {
        const uniqueExists = checkForUnique(groupId)
        if (uniqueExists) {
            showError(
                "Can't make group repeatable when it contains a unique property"
            )
            return
        }
    }

    const updatedGroup = {
        ...propertyGroupMap[groupId],
        ...(name && { name }),
        ...(repeatable !== undefined && { repeatable }),
    }

    updateGroup({ groupId, newConfig: updatedGroup })
}

export const onCollapse = (groupId: ItemId) => {
    const { collapsed } = propertyManager
    collapsed[groupId] = true
}

export const onExpand = (groupId: ItemId) => {
    const { collapsed } = propertyManager
    collapsed[groupId] = false
}

//Todo ensure form resets
