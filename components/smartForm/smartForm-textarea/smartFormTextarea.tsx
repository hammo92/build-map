import { Textarea, TextareaProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormTextareaProps = SmartFormInputBaseProps & TextareaProps;

export const SmartFormTextarea = (props: SmartFormTextareaProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <Textarea />
        </SmartFormDefaultController>
    );
};
