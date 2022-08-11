import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormMultiSelectProps = SmartFormInputBaseProps & MultiSelectProps;

export const SmartFormMultiSelect = (props: SmartFormMultiSelectProps) => {
    const converter = (value: string | any[]) => {
        if (!value) return [];
        else if (typeof value === "string") {
            return value.split(",");
        } else return value;
    };
    return (
        <SmartFormDefaultController {...props} converter={converter}>
            <MultiSelect data={props.data} />
        </SmartFormDefaultController>
    );
};
