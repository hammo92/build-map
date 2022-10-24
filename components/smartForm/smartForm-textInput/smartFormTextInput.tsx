import {
    createStyles,
    Text,
    TextInput,
    TextInputProps,
    TextProps,
} from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormTextInputProps = SmartFormInputBaseProps & TextInputProps

export const SmartFormTextInput = (props: SmartFormTextInputProps) => {
    return (
        <SmartFormController {...props}>
            <TextInput />
        </SmartFormController>
    )
}
