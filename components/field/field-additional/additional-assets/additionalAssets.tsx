import { FIELD_SUFFIXES } from '@components/content/content'
import { SmartForm } from '@components/smartForm'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { Field } from '@lib/field/data/field.model'
import { CleanedCamel } from '../../../../type-helpers'
import { ActionIcon } from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/pro-regular-svg-icons'

export const AdditionalAssets = ({ field }: { field: CleanedCamel<Field> }) => {
    const name = `${field.id}${FIELD_SUFFIXES.ASSETS}`
    const { setValue } = useFormContext()
    const value = useWatch({ name })
    const hidden = value === undefined || value === null

    return (
        <SmartForm.Assets
            name={`${field.id}${FIELD_SUFFIXES.ASSETS}`}
            label="Assets"
            hidden={hidden}
            multiple
            size="sm"
            rightContent={
                <ActionIcon
                    size={'sm'}
                    onClick={() =>
                        setValue(name, null, {
                            shouldDirty: true,
                            shouldTouch: true,
                        })
                    }
                >
                    <FontAwesomeIcon icon={faTrash} size={'sm'} />
                </ActionIcon>
            }
        />
    )
}
