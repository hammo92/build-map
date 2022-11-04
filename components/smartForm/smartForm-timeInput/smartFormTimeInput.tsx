import { TimeInput, TimeInputProps } from '@mantine/dates'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormTimeProps = SmartFormInputBaseProps &
    Omit<TimeInputProps, 'value' | 'defaultValue'> & {
        value?: string | Date | null
        defaultValue?: string | Date | null
    }

export const SmartFormTimeInput = (props: SmartFormTimeProps) => {
    return (
        <SmartFormController
            {...props}
            converter={(value) => value && dayjs(value).toDate()}
        >
            <TimeInput
                styles={{
                    disabled: {
                        color: '#ffffff',
                    },
                }}
            />
        </SmartFormController>
    )
}
