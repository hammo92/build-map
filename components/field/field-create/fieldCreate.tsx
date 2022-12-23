import { PropertyCreate } from '@components/property/property-create'
import { useCreateField } from '@data/field/hooks'
import React from 'react'
import { Button } from '@mantine/core'
import { ConfigurationOptions } from '@components/property/property-configuration/configuration-fields'
import { FieldType } from '@lib/field/data/field.model'

interface FieldCreateProps {
    parentId: string
    configurationOptions?: ConfigurationOptions
    hiddenTypes?: FieldType[]
}

export const FieldCreate = ({
    parentId,
    configurationOptions,
    hiddenTypes,
}: FieldCreateProps) => {
    const { mutateAsync } = useCreateField()
    return (
        <PropertyCreate
            isModal
            onCreate={(values) =>
                mutateAsync({ config: { ...values, parent: parentId } })
            }
            buttonElement={<Button>Add Field</Button>}
            hiddenTypes={hiddenTypes}
            configurationOptions={configurationOptions}
        />
    )
}
