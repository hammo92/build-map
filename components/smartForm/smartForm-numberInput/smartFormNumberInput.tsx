import { NumberInput, NumberInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormNumberInputProps = SmartFormInputBaseProps &
    NumberInputProps & {
        numberType?: "float" | "decimal" | "integer";
    };

export const SmartFormNumberInput = (props: SmartFormNumberInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <NumberInput />
        </SmartFormDefaultController>
    );
};
