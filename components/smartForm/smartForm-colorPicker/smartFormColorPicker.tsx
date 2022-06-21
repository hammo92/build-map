import {
    ColorPicker,
    ColorPickerProps,
    InputWrapper,
    InputWrapperProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormColorPickerProps = SmartFormInputBaseProps &
    ColorPickerProps &
    Omit<InputWrapperProps, "children">;

const WrappedColorPicker = forwardRef(
    (props: ColorPickerProps & Omit<InputWrapperProps, "children">, ref) => {
        const {
            label,
            error,
            required,
            description,
            descriptionProps,
            errorProps,
            id,
            labelElement,
            labelProps,
            ...rest
        } = props;
        return (
            <InputWrapper
                label={label}
                error={error}
                required={required}
                description={description}
                descriptionProps={descriptionProps}
                errorProps={errorProps}
                id={id}
                labelElement={labelElement}
                labelProps={labelProps}
                size={props.size}
                sx={{ display: "flex", flexDirection: "column" }}
            >
                <ColorPicker {...rest} />
            </InputWrapper>
        );
    }
);

WrappedColorPicker.displayName = "WrappedColorPicker";

export const SmartFormColorPicker = (props: SmartFormColorPickerProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedColorPicker />
        </SmartFormDefaultController>
    );
};
