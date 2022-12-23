import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'

export const FieldTypeCheckbox = ({
    field,
    ...rest
}: FieldProps<'checkbox'>) => {
    return (
        <SmartForm.Checkbox
            name={field.id}
            label={field.name}
            defaultChecked={field.defaultValue}
            checked={field.value}
            {...rest}
        />
    )
}
