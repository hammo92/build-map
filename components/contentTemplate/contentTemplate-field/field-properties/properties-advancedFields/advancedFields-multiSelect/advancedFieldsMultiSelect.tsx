import { SmartForm } from "@components/smartForm";
import { useFormContext } from "react-hook-form";
import { commaListToArray } from "utils/arrayModify";

export const AdvancedFieldsMultiSelect = () => {
    const { getValues } = useFormContext();
    // get values from select basic field "data"
    const data = getValues("data");
    // convert comma list to array of options
    const options = commaListToArray(data);
    const disabled = !options || options.length < 1;
    return (
        <SmartForm.MultiSelect
            label="Default values"
            name="defaultValue"
            data={options ?? []}
            disabled={disabled}
            description={disabled && "No options have been added yet, add options first."}
        />
    );
};
