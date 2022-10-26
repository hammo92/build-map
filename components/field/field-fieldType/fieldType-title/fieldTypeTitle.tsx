import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'

export const FieldTypeTitle = ({ field, ...rest }: FieldProps<'title'>) => {
    if (field.useTemplate) {
        return (
            <SmartForm.TitleInput
                name={field.id}
                label={field.name}
                {...rest}
            />
        )
    }
    return <SmartForm.TextInput name={field.id} label={field.name} {...rest} />
}
