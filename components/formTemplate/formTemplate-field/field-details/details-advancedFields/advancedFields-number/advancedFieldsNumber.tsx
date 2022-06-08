import { Grid, NumberInput, NumberInputProps, Select } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React, { useEffect, useState } from "react";
import { capitalise } from "utils/stringTransform";
import { useSnapshot } from "valtio";

export const AdvancedFieldsNumber = () => {
    const { fieldDetails, updateFieldConfig } = useSnapshot(formTemplateState);
    const [precision, setPrecision] = useState<NumberInputProps["precision"]>();
    console.log("fieldDetails", fieldDetails);
    useEffect(() => {
        switch (fieldDetails?.config?.subtype) {
            case "integer":
                setPrecision(0);
                break;
            case "decimal":
                setPrecision(2);
                break;
            case "float":
                setPrecision(10);
                break;
        }
    }, [fieldDetails?.config?.subtype]);

    // remove insignificant trailing zeroes from float
    const formatter = (value: string | undefined) => {
        if (value) {
            if (
                fieldDetails?.config?.subtype === "float" &&
                value.split(".")?.[1]?.length > 1
            ) {
                return parseFloat(value).toString();
            } else {
                return value;
            }
        }
        return "0";
    };

    return (
        <>
            <Grid.Col span={6}>
                <NumberInput
                    label="Minimum value"
                    value={fieldDetails?.config?.minimumValue}
                    max={fieldDetails?.config?.maximumValue}
                    precision={precision}
                    formatter={formatter}
                    onChange={(value) =>
                        updateFieldConfig({
                            minimumValue: value,
                        })
                    }
                />
            </Grid.Col>
            <Grid.Col span={6}>
                <NumberInput
                    label="Maximum value"
                    value={fieldDetails?.config?.maximumValue}
                    min={fieldDetails?.config?.minimumValue}
                    precision={precision}
                    formatter={formatter}
                    onChange={(value) =>
                        updateFieldConfig({
                            maximumValue: value,
                        })
                    }
                />
            </Grid.Col>
        </>
    );
};
