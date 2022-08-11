import { SmartForm } from "@components/smartForm";
import { useFormContext } from "react-hook-form";
import { commaListToArray } from "utils/arrayModify";

export const AdvancedFieldsSelect = () => {
    const { watch } = useFormContext();
    // get values from select basic field "data"
    const data = watch("data");
    // convert comma list to array of options
    const options = commaListToArray(data);
    const disabled = !options || options.length < 1;
    return (
        <SmartForm.Select
            label="Default value"
            name="defaultValue"
            data={options ?? []}
            disabled={disabled}
            description={disabled && "No options have been added yet, add options first."}
        />
    );
};
