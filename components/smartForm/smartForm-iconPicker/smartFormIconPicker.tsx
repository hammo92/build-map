import { IconPicker, IconPickerProps } from '@components/ui/iconPicker'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormIconPickerProps = SmartFormInputBaseProps & IconPickerProps

export const SmartFormIconPicker = (props: SmartFormIconPickerProps) => {
    return (
        <SmartFormController {...props}>
            <IconPicker onChange={props.onChange} />
        </SmartFormController>
    )
}
