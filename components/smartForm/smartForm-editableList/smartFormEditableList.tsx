import { EditableList, EditableListProps } from '@components/ui/editableList'
import React from 'react'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormEditableListProps<T> = SmartFormInputBaseProps &
    EditableListProps<T>

export const SmartFormEditableList = <T extends unknown>(
    props: SmartFormEditableListProps<T>
) => (
    <>
        <SmartFormController {...props}>
            <EditableList />
        </SmartFormController>
    </>
)
