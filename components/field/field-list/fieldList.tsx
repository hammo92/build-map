import { Field as FieldProps } from '@lib/field/data/field.model'
import { CleanedCamel } from 'type-helpers'
import { Field } from '../field'

export const FieldList = ({
    fields,
}: {
    fields: CleanedCamel<FieldProps>[]
}) => {
    return (
        <>
            {fields.map((field) => (
                <Field field={field} key={field.id} />
            ))}
        </>
    )
}
