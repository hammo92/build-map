import { SmartForm } from '@components/smartForm'
import { IMAGE_MIME_TYPE } from '@mantine/dropzone'
import { FieldProps } from '../../types'

export const FieldTypeImage = ({ field, ...rest }: FieldProps<'image'>) => {
    const { variant } = field
    if (variant === 'single')
        return (
            <SmartForm.Assets
                name={field.id}
                label={field.name}
                //accept={IMAGE_MIME_TYPE}
                defaultValue={field.defaultValue}
                value={field.value}
                {...rest}
            />
        )
    if (variant === 'multiple')
        return (
            <SmartForm.Assets
                multiple
                name={field.id}
                label={field.name}
                //accept={IMAGE_MIME_TYPE}
                defaultValue={field.defaultValue}
                value={field.value}
                {...rest}
            />
        )
    return null
}
