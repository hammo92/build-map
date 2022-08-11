import { SmartForm } from "@components/smartForm";
import { useState } from "react";
import { useFormContext } from "react-hook-form";

export const AdvancedFieldsCommon = () => {
    const { setValue, getValues } = useFormContext();
    const [disabled, setDisabled] = useState(
        ["issuer", "recipient"].includes(getValues("permissions.visibleTo"))
    );
    return (
        <>
            <SmartForm.SegmentedControl
                label="Visible to"
                name={"permissions.visibleTo"}
                fullWidth
                data={[
                    { label: "Issuer", value: "issuer" },
                    { label: "Recipient", value: "recipient" },
                    { label: "Both", value: "all" },
                ]}
                onChange={(value) => {
                    if (typeof value === "string") {
                        if (["issuer", "recipient"].includes(value)) {
                            setValue("permissions.visibleTo", value);
                            setValue("permissions.editableBy", value);
                            setDisabled(true);
                        } else {
                            setValue("permissions.visibleTo", value);
                            setDisabled(false);
                        }
                    }
                }}
            />

            <SmartForm.SegmentedControl
                label="Editable by"
                name={"permissions.editableBy"}
                fullWidth
                disabled={disabled}
                data={[
                    { label: "Issuer", value: "issuer" },
                    { label: "Recipient", value: "recipient" },
                    { label: "Both", value: "all" },
                ]}
            />
        </>
    );
};
