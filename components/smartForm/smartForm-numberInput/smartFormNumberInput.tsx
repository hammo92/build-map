import { NumberInput, NumberInputProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormNumberInputProps = SmartFormInputBaseProps &
    NumberInputProps & {
        numberType?: 'float' | 'decimal' | 'integer'
    }

export const SmartFormNumberInput = (props: SmartFormNumberInputProps) => {
    return (
        <SmartFormController {...props}>
            <NumberInput />
        </SmartFormController>
    )
}
