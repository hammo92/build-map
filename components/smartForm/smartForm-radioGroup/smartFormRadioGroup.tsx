import { RadioGroup, RadioGroupProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormRadioGroupProps = SmartFormInputBaseProps & RadioGroupProps;

export const SmartFormRadioGroup = (props: SmartFormRadioGroupProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <RadioGroup>{props.children}</RadioGroup>
        </SmartFormDefaultController>
    );
};
