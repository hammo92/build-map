import { JsonInput, JsonInputProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormJsonInputProps = SmartFormInputBaseProps & JsonInputProps

export const SmartFormJsonInput = (props: SmartFormJsonInputProps) => {
    return (
        <SmartFormController {...props}>
            <JsonInput />
        </SmartFormController>
    )
}
