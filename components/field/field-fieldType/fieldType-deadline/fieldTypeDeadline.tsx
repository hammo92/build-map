import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'
import dayjs from 'dayjs'

export const FieldTypeDeadline = ({
    field,
    ...rest
}: FieldProps<'deadline'>) => {
    return (
        <SmartForm.DateTime
            name={field.id}
            label={field.name}
            defaultValue={field.defaultValue ?? 'null'}
            value={field.value}
            {...rest}
        />
    )
}
