import { IconTitle } from '@components/ui/iconTitle/iconTitle'
import { Property } from '@lib/field/data/field.model'
import { ActionIcon, Card, Group, Menu } from '@mantine/core'
import { splitCamel } from 'utils/stringTransform'
import { FIELD_TYPES } from '../property-type/type-select/options'
import { useStyles } from './styles'
import React from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { PropertyDelete } from '@components/property/property-delete'
import { PropertyEdit } from '@components/property/property-edit'
import {
    faEdit,
    faEllipsisV,
    faLayerGroup,
    faTrash,
} from '@fortawesome/pro-solid-svg-icons'
import { ConvertComponent } from '@components/property/property-convert/convert-component'

interface PropertyItemProps {
    property: Property
    isEditable?: boolean
    leftContent?: React.ReactNode
    grow?: boolean
}

const fieldSubtitle = (property: Property) => {
    const typeString = splitCamel(property.type)
    switch (property.type) {
        case 'number':
            return `${typeString} - ${splitCamel(property?.variant ?? '')}`
        case 'text':
            return `${typeString} - ${splitCamel(property?.variant ?? '')}`
        default:
            return typeString
    }
}

export const PropertyItem = ({
    property,
    isEditable,
    leftContent,
    grow,
}: PropertyItemProps) => {
    const { classes } = useStyles()

    return (
        <Card sx={{ flex: grow ? 1 : 'auto' }} py="sm">
            <Group position="apart">
                <Group>
                    {!!leftContent && leftContent}
                    <div className={classes.propertyTitle}>
                        <IconTitle
                            title={property.name}
                            subtitle={fieldSubtitle(property)}
                            icon={FIELD_TYPES[property.type].icon}
                            iconProps={{
                                color: property.unique ? 'teal' : 'blue',
                            }}
                        />
                    </div>
                </Group>
                {isEditable && (
                    <Menu withinPortal position={'left-start'}>
                        <Menu.Target>
                            <ActionIcon>
                                <FontAwesomeIcon icon={faEllipsisV} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Actions</Menu.Label>
                            <PropertyEdit
                                property={property}
                                isModal
                                buttonElement={
                                    <Menu.Item
                                        icon={<FontAwesomeIcon icon={faEdit} />}
                                    >
                                        Edit Property
                                    </Menu.Item>
                                }
                            />
                            {property.type === 'component' && (
                                <ConvertComponent
                                    property={property as Property<'component'>}
                                    buttonElement={
                                        <Menu.Item
                                            icon={
                                                <FontAwesomeIcon
                                                    icon={faLayerGroup}
                                                />
                                            }
                                        >
                                            Create Group from Component
                                        </Menu.Item>
                                    }
                                />
                            )}
                            <Menu.Divider />
                            <Menu.Label>Danger Zone</Menu.Label>
                            <PropertyDelete
                                property={property}
                                buttonElement={
                                    <Menu.Item
                                        icon={
                                            <FontAwesomeIcon icon={faTrash} />
                                        }
                                        color={'red'}
                                    >
                                        Delete Property
                                    </Menu.Item>
                                }
                            />
                        </Menu.Dropdown>
                    </Menu>
                )}
            </Group>
        </Card>
    )
}
