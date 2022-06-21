import { TextInput, TextInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormTextInputProps = SmartFormInputBaseProps & TextInputProps;

export const SmartFormTextInput = (props: SmartFormTextInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <TextInput />
        </SmartFormDefaultController>
    );
};
