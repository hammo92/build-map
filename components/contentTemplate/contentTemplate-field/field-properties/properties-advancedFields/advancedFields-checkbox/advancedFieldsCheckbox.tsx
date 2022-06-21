import { SmartForm } from "@components/smartForm";

export const AdvancedFieldsCheckbox = () => {
    return (
        <SmartForm.SegmentedControl
            name="defaultValue"
            label="Default Value"
            fullWidth
            data={[
                { label: "Checked", value: "true" },
                { label: "Unchecked", value: "false" },
            ]}
        />
    );
};
