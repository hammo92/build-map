import { SmartForm } from "@components/smartForm";
import React from "react";

export const FieldsCheckbox = () => (
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
