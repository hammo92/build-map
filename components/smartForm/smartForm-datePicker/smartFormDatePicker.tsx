import { DatePicker, DatePickerProps } from '@mantine/dates'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormDatePickerProps = SmartFormInputBaseProps & DatePickerProps

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
