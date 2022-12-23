import { SmartForm } from '@components/smartForm'
import { OptionListRenderItem } from '@components/ui/optionList/optionList-renderItem'
import { OptionListSelectItem } from '@components/ui/optionList/optionList-selectItem'
import { FieldProps } from '../../types'

export const FieldTypeMultiSelect = ({
    field,
    ...rest
}: FieldProps<'multiSelect'>) => {
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
            dropdownPosition={'flip'}
            defaultValue={field.defaultValue}
            value={field.value}
            {...displayProps}
            {...rest}
        />
    )
}
