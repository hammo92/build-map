import { Checkbox, CheckboxProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormCheckboxProps = SmartFormInputBaseProps & CheckboxProps;

export const SmartFormCheckbox = (props: SmartFormCheckboxProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <Checkbox />
        </SmartFormDefaultController>
    );
};
