import { IconTitle } from '@components/ui/iconTitle/iconTitle'
import { FieldType } from '@lib/field/data/field.model'
import { Button, Text } from '@mantine/core'
import { closeAllModals, useModals } from '@mantine/modals'
import { createProperty } from '@state/propertyManager'
import React, { useState } from 'react'
import { splitCamel } from 'utils/stringTransform'
import { proxy, useSnapshot } from 'valtio'
import { PropertyConfiguration } from '../property-configuration'
import { TypeSelect } from '../property-type/type-select'
import {
    FIELD_TYPES,
    UNIQUE_FIELDS,
} from '../property-type/type-select/options'
import { getFieldDefaults } from './create-utils/getFieldDefaults'
import { ConfigurationOptions } from '@components/property/property-configuration/configuration-fields'
import { checkForRepeatable } from '@state/propertyManager'
import { contentTemplateState } from '@state/contentTemplate'

interface PropertyCreatePropsBase {
    onCreate?: (values: any) => void
    parentId?: string
    hiddenTypes?: FieldType[]
    configurationOptions?: ConfigurationOptions
}

interface PropertyCreateModalProps extends PropertyCreatePropsBase {
    isModal: true
    buttonElement?: React.ReactElement
}

interface PropertyCreateNonModal extends PropertyCreatePropsBase {
    isModal?: true
    buttonElement?: never
}

type PropertyCreateProps = PropertyCreateModalProps | PropertyCreateNonModal

const typeState = proxy<{ type: FieldType | undefined }>({ type: undefined })

const PropertyCreateSteps = ({
    onCreate,
    hiddenTypes,
    configurationOptions,
}: {
    onCreate: (values: any) => void
    hiddenTypes?: FieldType[]
    configurationOptions?: ConfigurationOptions
}) => {
    const { type } = useSnapshot(typeState)
    const [step, setStep] = useState(0)
    if (!type || step === 0) {
        return (
            <TypeSelect
                onSelect={(type) => {
                    typeState.type = type
                    setStep(1)
                }}
                hiddenTypes={hiddenTypes}
            />
        )
    }
    if (type) {
        return (
            <PropertyConfiguration
                currentConfig={getFieldDefaults(type)}
                type={type}
                onSubmit={onCreate}
                onCancel={() => {
                    setStep(0)
                    typeState.type = undefined
                }}
                view="create"
                configurationOptions={configurationOptions}
            />
        )
    }
    return null
}

const Title = () => {
    const { type } = useSnapshot(typeState)
    if (type) {
        return (
            <IconTitle
                icon={FIELD_TYPES[type]['icon']}
                title={`New ${splitCamel(type)} Property`}
                subtitle="Configure field options"
            />
        )
    }
    return <Text>Select Property Type</Text>
}

export const PropertyCreate = ({
    onCreate,
    isModal,
    buttonElement,
    parentId = '1',
    hiddenTypes,
    configurationOptions,
}: PropertyCreateProps) => {
    const modals = useModals()
    const { templateType } = useSnapshot(contentTemplateState)
    const parentIsRepeatable = checkForRepeatable(parentId)
    const isComponent = templateType === 'component'
    if (isModal) {
        const openModal = () => {
            modals.openModal({
                title: <Title />,
                size: 'xl',
                closeOnClickOutside: false,
                children: (
                    <PropertyCreateSteps
                        onCreate={(values) => {
                            onCreate
                                ? onCreate({ ...values, parentId })
                                : createProperty({ ...values, parentId })
                            closeAllModals()
                        }}
                        hiddenTypes={[
                            ...(hiddenTypes ? hiddenTypes : []),
                            ...(parentIsRepeatable || isComponent
                                ? UNIQUE_FIELDS
                                : []),
                        ]}
                        configurationOptions={{
                            ...configurationOptions,
                            ...(isComponent && { disableReciprocal: true }),
                        }}
                    />
                ),
            })
        }
        return (
            <>
                {buttonElement ? (
                    React.cloneElement(buttonElement, {
                        onClick: () => openModal(),
                    })
                ) : (
                    <Button
                        fullWidth
                        variant="light"
                        color="blue"
                        onClick={() => openModal()}
                    >
                        Add Property
                    </Button>
                )}
            </>
        )
    }
    return (
        <PropertyCreateSteps
            onCreate={(values) =>
                onCreate
                    ? onCreate({ ...values, parentId })
                    : createProperty({ ...values, parentId })
            }
        />
    )
}
