import { ColorInput, ColorInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormColorInputProps = SmartFormInputBaseProps & ColorInputProps;

export const SmartFormColorInput = (props: SmartFormColorInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <ColorInput />
        </SmartFormDefaultController>
    );
};
