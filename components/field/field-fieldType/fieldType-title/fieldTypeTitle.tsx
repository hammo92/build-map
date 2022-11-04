import { SmartForm } from '@components/smartForm'
import { FieldProps } from '../../types'
import { TitleElementProps } from '@components/ui/title/title-builder/titleBuilder-element'

export const FieldTypeTitle = ({ field, ...rest }: FieldProps<'title'>) => {
    if (field.useTemplate) {
        return (
            <SmartForm.TitleInput
                name={field.id}
                label={field.name}
                defaultValue={field.defaultValue as TitleElementProps[]}
                value={field.value as TitleElementProps[]}
                {...rest}
            />
        )
    }
    if (!field.useTemplate) {
        return (
            <SmartForm.TextInput
                name={field.id}
                label={field.name}
                {...rest}
                defaultValue={field.defaultValue as string}
                value={field.value as string}
            />
        )
    }
    return null
}
