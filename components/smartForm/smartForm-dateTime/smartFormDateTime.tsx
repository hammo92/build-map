import { DateTime, DateTimeProps } from '@components/ui/dateTime'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormDateTimeProps = SmartFormInputBaseProps &
    Omit<DateTimeProps, 'value' | 'defaultValue'> & {
        value?: string | Date | null
        defaultValue?: string | Date | null
    }

export const SmartFormDateTime = (props: SmartFormDateTimeProps) => {
    return (
        <SmartFormController
            {...props}
            converter={(value) => value && dayjs(value).toDate()}
        >
            <DateTime />
        </SmartFormController>
    )
}
