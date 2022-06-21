import { JsonInput, JsonInputProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormJsonInputProps = SmartFormInputBaseProps & JsonInputProps;

export const SmartFormJsonInput = (props: SmartFormJsonInputProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <JsonInput />
        </SmartFormDefaultController>
    );
};
