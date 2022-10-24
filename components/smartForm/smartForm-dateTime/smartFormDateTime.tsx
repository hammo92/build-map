import { DateTime, DateTimeProps } from '@components/ui/dateTime'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormDateTimeProps = SmartFormInputBaseProps & DateTimeProps

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
