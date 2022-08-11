import { Checkbox, CheckboxProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormCheckboxProps = SmartFormInputBaseProps & CheckboxProps;

// Checkbox needs checked rather than value prop
const Check = (props: CheckboxProps & { value?: string | boolean }) => {
    let value = ["true", "yes", true].includes(props.value ?? "");
    return <Checkbox {...props} checked={value} />;
};

export const SmartFormCheckbox = (props: SmartFormCheckboxProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <Check />
        </SmartFormDefaultController>
    );
};
