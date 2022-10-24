import { SmartForm } from '@components/smartForm'
import { OptionListRenderItem } from '@components/ui/optionList/optionList-renderItem'
import { OptionListSelectItem } from '@components/ui/optionList/optionList-selectItem'
import { Option } from '@lib/responseSet/data/responseSet.model'
import { useFormContext } from 'react-hook-form'

export const FieldsSelect = ({ type }: { type: 'select' | 'multiSelect' }) => {
    const { watch, setValue } = useFormContext()
    const data = watch('data') ?? []
    const defaultValue: string[] = watch('defaultValue') ?? []

    // remove value from default values when deleted
    const handleDelete = (option: Option) => {
        if (!Array.isArray(defaultValue)) return
        setValue(
            'defaultValue',
            defaultValue.filter((value) => value !== option.value)
        )
    }
    const disabled = !data || data.length < 1
    const selectProps = type === 'select' ? { maxSelectedValues: 1 } : {}
    return (
        <>
            <SmartForm.OptionList
                name="data"
                required
                description="You can add multiple by separating with a comma"
                label="Options"
                onRemove={handleDelete}
                placeholder={'option 1, option 2, option 3'}
            />
            {!!data.length && (
                <SmartForm.MultiSelect
                    label="Default values"
                    name="defaultValue"
                    data={data ?? []}
                    disabled={disabled}
                    description={
                        disabled &&
                        'No options have been added yet, add options first.'
                    }
                    itemComponent={OptionListSelectItem}
                    valueComponent={OptionListRenderItem}
                    {...selectProps}
                />
            )}
        </>
    )
}
