import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'

export const FieldTypeEmail = ({ field, ...rest }: FieldProps<'email'>) => {
    return (
        <SmartForm.TextInput
            type="email"
            name={field.id}
            label={field.name}
            defaultValue={field.defaultValue}
            value={field.value}
            {...rest}
        />
    )
}
