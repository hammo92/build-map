import { MultiSelect, MultiSelectProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormMultiSelectProps = SmartFormInputBaseProps & MultiSelectProps

export const SmartFormMultiSelect = (props: SmartFormMultiSelectProps) => {
    const converter = (value: string | any[]) => {
        if (!value) return []
        else if (typeof value === 'string') {
            return value.split(',')
        } else return value
    }
    return (
        <SmartFormController {...props} converter={converter}>
            <MultiSelect data={props.data} />
        </SmartFormController>
    )
}
