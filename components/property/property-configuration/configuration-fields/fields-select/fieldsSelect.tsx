import { SmartForm } from "@components/smartForm";
import React from "react";
import { useFormContext } from "react-hook-form";
import { commaListToArray } from "utils/arrayModify";

export const FieldsSelect = () => {
    const { watch } = useFormContext();
    const data = watch("data");
    const options = commaListToArray(data);
    const disabled = !options || options.length < 1;
    return (
        <>
            <SmartForm.Textarea
                name="data"
                label="Options"
                required
                description="Enter a list of options seperated by commas"
                placeholder="eg: first, second, third"
            />
            <SmartForm.Select
                label="Default value"
                name="defaultValue"
                data={options ?? []}
                disabled={disabled}
                description={disabled && "No options have been added yet, add options first."}
            />
        </>
    );
};
