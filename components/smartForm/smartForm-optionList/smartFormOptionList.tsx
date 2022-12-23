import { OptionList, OptionListProps } from '@components/ui/optionList'
import React from 'react'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormIconPickerProps = SmartFormInputBaseProps & OptionListProps

export const SmartFormOptionList = (props: SmartFormIconPickerProps) => {
    return (
        <SmartFormController {...props}>
            <OptionList />
        </SmartFormController>
    )
}
