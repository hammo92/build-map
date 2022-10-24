import { Select, SelectProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormSelectProps = SmartFormInputBaseProps & SelectProps

export const SmartFormSelect = (props: SmartFormSelectProps) => {
    return (
        <SmartFormController {...props}>
            <Select data={props.data} />
        </SmartFormController>
    )
}
