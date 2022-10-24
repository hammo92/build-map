import { TimeInput, TimeInputProps } from '@mantine/dates'
import dayjs from 'dayjs'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormTimeProps = SmartFormInputBaseProps & TimeInputProps

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
