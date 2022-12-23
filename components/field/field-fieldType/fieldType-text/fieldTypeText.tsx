import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'

export const FieldTypeText = ({ field, ...rest }: FieldProps<'text'>) => {
    const { variant } = field
    if (variant === 'shortText')
        return (
            <SmartForm.TextInput
                name={field.id}
                label={field.name}
                defaultValue={field.defaultValue}
                value={field.value}
                {...rest}
            />
        )
    if (variant === 'longText')
        return (
            <SmartForm.Textarea
                name={field.id}
                label={field.name}
                defaultValue={field.defaultValue}
                value={field.value}
                {...rest}
            />
        )
    return null
}
