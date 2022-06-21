import { Select, SelectProps } from "@mantine/core";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormSelectProps = SmartFormInputBaseProps & SelectProps;

export const SmartFormSelect = (props: SmartFormSelectProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <Select data={props.data} />
        </SmartFormDefaultController>
    );
};
