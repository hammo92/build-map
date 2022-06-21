import { MultiSelect, MultiSelectProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormMultiSelectProps = SmartFormInputBaseProps & MultiSelectProps;

export const SmartFormMultiSelect = (props: SmartFormMultiSelectProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <MultiSelect data={props.data} />
        </SmartFormDefaultController>
    );
};
