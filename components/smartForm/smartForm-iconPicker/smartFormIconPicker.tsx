import { IconPicker, IconPickerProps } from "@components/ui/iconPicker";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormIconPickerProps = SmartFormInputBaseProps & IconPickerProps;

export const SmartFormIconPicker = (props: SmartFormIconPickerProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <IconPicker onChange={props.onChange} />
        </SmartFormDefaultController>
    );
};
