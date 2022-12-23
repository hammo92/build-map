import { SmartForm } from '@components/smartForm'
import { Field } from '@lib/field/data/field.model'
import { CleanedCamel } from 'type-helpers'
import { FieldProps } from '../../types'

export const FieldTypeNumber = ({ field, ...rest }: FieldProps<'number'>) => {
    return (
        <SmartForm.NumberInput
            precision={
                field.variant === 'decimal'
                    ? 2
                    : field.variant === 'float'
                    ? 5
                    : 0
            }
            name={field.id}
            label={field.name}
            min={field.minimumValue}
            max={field.maximumValue}
            defaultValue={field.defaultValue}
            value={field.value}
            {...rest}
        />
    )
}
