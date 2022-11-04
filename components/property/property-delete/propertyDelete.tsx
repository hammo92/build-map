import { faTrash } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Property } from '@lib/field/data/field.model'
import { ActionIcon, Button } from '@mantine/core'
import { useModals } from '@mantine/modals'
import { deleteProperty } from '@state/propertyManager'
import React from 'react'
import { PropertyItem } from '../property-item'

export const PropertyDelete = ({
    property,
    buttonElement,
}: {
    property: Property
    buttonElement?: React.ReactElement
}) => {
    const modals = useModals()
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            //id: "detailsModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: 'xl',
            groupProps: { grow: true },
            confirmProps: { color: 'red' },
            labels: { confirm: 'Delete', cancel: 'Cancel' },
            onConfirm: async () => {
                deleteProperty(property.id)
            },
            children: <PropertyItem isEditable={false} property={property} />,
        })

    return (
        <>
            {buttonElement ? (
                React.cloneElement(buttonElement, {
                    onClick: () => openDeleteModal(),
                })
            ) : (
                <ActionIcon
                    color="red"
                    onClick={() => {
                        openDeleteModal()
                    }}
                >
                    <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
            )}
        </>
    )
}
