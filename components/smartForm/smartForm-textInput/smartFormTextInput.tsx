import { createStyles, Text, TextInput, TextInputProps, TextProps } from "@mantine/core";
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
