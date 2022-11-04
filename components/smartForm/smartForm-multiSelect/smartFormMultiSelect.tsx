import { MultiSelect, MultiSelectProps } from '@mantine/core'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'
import { Option } from '@lib/responseSet/data/responseSet.model'

type SmartFormMultiSelectProps = SmartFormInputBaseProps &
    Omit<MultiSelectProps, 'value' | 'defaultValue'> & {
        value?: string[] | Option[] | null
        defaultValue?: string[] | Option[] | null
    }

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
