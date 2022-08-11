import { Chip, ChipProps, Input, InputWrapperProps } from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormChipsProps = SmartFormInputBaseProps & ChipProps & InputWrapperProps;

const WrappedChips = forwardRef((props: ChipProps & InputWrapperProps, ref) => {
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
        <Input.Wrapper
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
            <Chip {...rest} />
        </Input.Wrapper>
    );
});

WrappedChips.displayName = "WrappedChips";

export const SmartFormChips = <T extends boolean>(props: SmartFormChipsProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedChips>{props.children}</WrappedChips>
        </SmartFormDefaultController>
    );
};
