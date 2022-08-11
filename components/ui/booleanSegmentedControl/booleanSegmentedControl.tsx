import { SegmentedControl, SegmentedControlProps } from "@mantine/core";
import React from "react";

export interface BooleanSegmentedControlProps
    extends Omit<SegmentedControlProps, "data" | "onChange" | "defaultValue" | "value"> {
    onChange?: (value: boolean) => void;
    defaultValue?: boolean;
    trueLabel?: string;
    falseLabel?: string;
    value?: boolean;
}

export const BooleanSegmentedControl = (props: BooleanSegmentedControlProps) => {
    const { defaultValue, trueLabel, falseLabel, onChange, value, ...rest } = props;
    const convertFromBoolean = (value: boolean): "true" | "false" =>
        value === true ? "true" : "false";
    const convertFromString = (value: string): boolean => value === "true" ?? false;
    const parsedValue = value
        ? convertFromBoolean(value)
        : defaultValue
        ? convertFromBoolean(defaultValue)
        : "false";
    return (
        <SegmentedControl
            {...rest}
            value={parsedValue}
            defaultValue={convertFromBoolean(defaultValue ?? false)}
            onChange={(value) => onChange && onChange(convertFromString(value))}
            data={[
                { value: "true", label: props.trueLabel ?? "Yes" },
                { value: "false", label: props.falseLabel ?? "No" },
            ]}
        />
    );
};
