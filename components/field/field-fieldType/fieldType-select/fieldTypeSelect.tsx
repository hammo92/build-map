import { SmartForm } from '@components/smartForm'
import { OptionListRenderItem } from '@components/ui/optionList/optionList-renderItem'
import { OptionListSelectItem } from '@components/ui/optionList/optionList-selectItem'
import { Field } from '@lib/field/data/field.model'
import { CleanedCamel } from 'type-helpers'
import { FieldProps } from '../../types'

export const FieldTypeSelect = ({ field, ...rest }: FieldProps<'select'>) => {
    const displayProps = field.data?.every((item) => item.color)
        ? {
              itemComponent: OptionListSelectItem,
              valueComponent: OptionListRenderItem,
          }
        : {}
    return (
        <SmartForm.MultiSelect
            name={field.id}
            label={field.name}
            data={field.data ?? []}
            withinPortal={true}
            maxSelectedValues={1}
            defaultValue={field.defaultValue}
            value={field.value}
            {...displayProps}
            {...rest}
        />
    )
}
