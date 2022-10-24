import { PasswordInput, PasswordInputProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormPasswordInputProps = SmartFormInputBaseProps & PasswordInputProps

export const SmartFormPasswordInput = (props: SmartFormPasswordInputProps) => {
    return (
        <SmartFormController {...props}>
            <PasswordInput />
        </SmartFormController>
    )
}
