import { FIELD_SUFFIXES } from '@components/content/content'
import { SmartForm } from '@components/smartForm'
import { faNote, faTrash } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ContentField } from '@lib/content/data/types'
import { Button, Group, Menu } from '@mantine/core'
import { openModal } from '@mantine/modals'
import React, { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { CleanedCamel } from '../../../../../type-helpers'
import { Field } from '@lib/field/data/field.model'

/*const AddNoteModalContent = ({ onClick }: { onClick: (note: string) => void }) => (
    <SmartForm
        formName="addNote"
        onSubmit={(values: { note: string }) => {
            onClick(values.note);
        }}
    >
        <SmartForm.Textarea name="note" label="Note Content" required />
        <Group grow>
            <Button mt="md" color="gray" variant="light">
                Cancel
            </Button>
            <Button type="submit" mt="md">
                Create
            </Button>
        </Group>
    </SmartForm>
);
*/

export const MenuAddNote = ({ field }: { field: CleanedCamel<Field> }) => {
    const { setValue, getValues } = useFormContext()
    const formField = `${field.id}${FIELD_SUFFIXES.NOTE}`
    const value = getValues(formField)
    const hasValue = value !== null && value !== undefined
    const onClick = () => {
        if (hasValue) {
            setValue(formField, null, {
                shouldDirty: true,
                shouldTouch: true,
            })
        } else {
            setValue(formField, '', {
                shouldDirty: true,
                shouldTouch: true,
            })
        }
    }

    return (
        <>
            <Menu.Item
                icon={<FontAwesomeIcon icon={hasValue ? faTrash : faNote} />}
                onClick={onClick}
                color={hasValue ? 'red' : 'gray'}
            >
                {hasValue ? 'Delete Note' : 'Add Note'}
            </Menu.Item>
        </>
    )
}
