import { DatePicker, DatePickerProps } from '@mantine/dates'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'
import { DateTimeProps } from '@components/ui/dateTime'

type SmartFormDatePickerProps = SmartFormInputBaseProps &
    Omit<DatePickerProps, 'value' | 'defaultValue'> & {
        value?: string | Date | null
        defaultValue?: string | Date | null
    }

export const SmartFormDatePicker = (props: SmartFormDatePickerProps) => {
    return (
        <SmartFormController
            {...props}
            converter={(value) => value && dayjs(value).toDate()}
        >
            <DatePicker />
        </SmartFormController>
    )
}
