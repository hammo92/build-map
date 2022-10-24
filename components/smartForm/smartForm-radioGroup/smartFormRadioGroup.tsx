import { RadioGroup, RadioGroupProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormRadioGroupProps = SmartFormInputBaseProps & RadioGroupProps

export const SmartFormRadioGroup = (props: SmartFormRadioGroupProps) => {
    return (
        <SmartFormController {...props}>
            <RadioGroup>{props.children}</RadioGroup>
        </SmartFormController>
    )
}
