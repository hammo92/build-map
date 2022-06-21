import { NumberInput, NumberInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormNumberInputProps = SmartFormInputBaseProps & NumberInputProps;

export const SmartFormNumberInput = (props: SmartFormNumberInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <NumberInput />
        </SmartFormDefaultController>
    );
};
