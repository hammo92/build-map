import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'
import dayjs from 'dayjs'

export const FieldTypeDate = ({ field, ...rest }: FieldProps<'date'>) => {
    switch (field.variant) {
        case 'dateTime':
            return (
                <SmartForm.DateTime
                    name={field.id}
                    label={field.name}
                    defaultValue={field.defaultValue ?? 'null'}
                    value={field.value}
                    {...rest}
                />
            )
        case 'date':
            return (
                <SmartForm.DatePicker
                    name={field.id}
                    label={field.name}
                    defaultValue={field.defaultValue}
                    value={field.value}
                    {...rest}
                />
            )
        case 'time':
            return (
                <SmartForm.TimeInput
                    name={field.id}
                    label={field.name}
                    defaultValue={field.defaultValue}
                    value={field.value}
                    {...rest}
                />
            )
        default:
            return null
    }
}
