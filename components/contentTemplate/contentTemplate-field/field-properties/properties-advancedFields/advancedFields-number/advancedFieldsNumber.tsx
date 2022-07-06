import { SmartForm } from "@components/smartForm";
import { Checkbox, Group, NumberInputProps } from "@mantine/core";
import { useEffect, useState } from "react";
import { useFormContext } from "react-hook-form";
import { capitalise } from "utils/stringTransform";

interface ValueLimiterProps extends NumberInputProps {
    limitType: "max" | "min";
}

const ValueLimiter = (props: ValueLimiterProps) => {
    const { limitType, ...rest } = props;
    const { getValues, setValue } = useFormContext();
    const [active, setActive] = useState(getValues(limitType));
    return (
        <Group direction="column" spacing="sm" grow>
            <Checkbox
                checked={active}
                onChange={(event) => {
                    const { checked } = event.currentTarget;
                    setActive(checked);
                    !checked && setValue(limitType, undefined);
                }}
                label={`${capitalise(limitType)}imum Value`}
            />
            <SmartForm.NumberInput name={limitType} {...rest} disabled={!active} />
        </Group>
    );
};

export const AdvancedFieldsNumber = () => {
    const { watch } = useFormContext();
    const subtype = watch("subtype");
    const [precision, setPrecision] = useState<NumberInputProps["precision"]>();
    const min = watch("min");
    const max = watch("max");
    useEffect(() => {
        switch (subtype) {
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
    }, [subtype]);

    // remove insignificant trailing zeroes from float
    //! Currently strips all trailing zeroes, need solution
    //Todo improve formatter to run on blur
    const formatter = (value: string | undefined) => {
        if (value) {
            if (subtype === "float" && value.split(".")?.[1]?.length > 1) {
                return parseFloat(value).toString();
            } else {
                return value;
            }
        }
        return "0";
    };
    return (
        <SmartForm.FieldGroup cols={2}>
            <ValueLimiter max={max} precision={precision} formatter={formatter} limitType="min" />
            <ValueLimiter min={min} precision={precision} formatter={formatter} limitType="max" />
        </SmartForm.FieldGroup>
    );
};
