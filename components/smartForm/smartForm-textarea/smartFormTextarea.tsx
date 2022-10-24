import { Textarea, TextareaProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormTextareaProps = SmartFormInputBaseProps & TextareaProps

export const SmartFormTextarea = (props: SmartFormTextareaProps) => {
    return (
        <SmartFormController {...props}>
            <Textarea />
        </SmartFormController>
    )
}
