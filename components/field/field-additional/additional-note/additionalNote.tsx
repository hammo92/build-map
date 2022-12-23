import { FIELD_SUFFIXES } from '@components/content/content'
import { SmartForm } from '@components/smartForm'
import React from 'react'
import { useFormContext, useWatch } from 'react-hook-form'
import { CleanedCamel } from '../../../../type-helpers'
import { Field } from '@lib/field/data/field.model'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash } from '@fortawesome/pro-regular-svg-icons'
import { ActionIcon } from '@mantine/core'

export const AdditionalNote = ({ field }: { field: CleanedCamel<Field> }) => {
    const name = `${field.id}${FIELD_SUFFIXES.NOTE}`
    const { setValue } = useFormContext()
    const value = useWatch({ name })
    const hideNote = value === undefined || value === null

    return (
        <SmartForm.Textarea
            name={`${field.id}${FIELD_SUFFIXES.NOTE}`}
            label="Note"
            hidden={hideNote}
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
