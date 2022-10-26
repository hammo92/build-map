import { Checkbox, CheckboxProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormCheckboxProps = SmartFormInputBaseProps & CheckboxProps

// Checkbox needs checked rather than value prop
const Check = (props: CheckboxProps & { value?: string | boolean }) => {
    let value = ['true', 'yes', true].includes(props.value ?? '')
    return (
        <Checkbox
            {...props}
            checked={value}
            styles={{ input: { cursor: 'pointer' } }}
        />
    )
}

export const SmartFormCheckbox = (props: SmartFormCheckboxProps) => {
    return (
        <SmartFormController {...props} view="checkbox">
            <Check />
        </SmartFormController>
    )
}
