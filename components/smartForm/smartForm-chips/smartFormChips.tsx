import {
    Chips,
    ChipsProps,
    InputWrapper,
    InputWrapperProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormChipsProps<T extends boolean> = SmartFormInputBaseProps &
    ChipsProps<T> &
    InputWrapperProps;

const WrappedChips = forwardRef(
    (props: ChipsProps & InputWrapperProps, ref) => {
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
                <Chips {...rest} />
            </InputWrapper>
        );
    }
);

WrappedChips.displayName = "WrappedChips";

export const SmartFormChips = <T extends boolean>(
    props: SmartFormChipsProps<T>
) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedChips>{props.children}</WrappedChips>
        </SmartFormDefaultController>
    );
};
