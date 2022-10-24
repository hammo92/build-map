import { ColorInput, ColorInputProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormColorInputProps = SmartFormInputBaseProps & ColorInputProps

export const SmartFormColorInput = (props: SmartFormColorInputProps) => {
    return (
        <SmartFormController {...props}>
            <ColorInput />
        </SmartFormController>
    )
}
