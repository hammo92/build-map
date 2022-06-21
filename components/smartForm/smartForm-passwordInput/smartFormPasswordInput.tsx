import { PasswordInput, PasswordInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormPasswordInputProps = SmartFormInputBaseProps & PasswordInputProps;

export const SmartFormPasswordInput = (props: SmartFormPasswordInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <PasswordInput />
        </SmartFormDefaultController>
    );
};
