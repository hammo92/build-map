import {
    Group,
    Input,
    InputWrapperProps,
    SegmentedControl,
    SegmentedControlProps,
} from "@mantine/core";
import { forwardRef } from "react";
import { SmartFormDefaultController } from "../smartForm-defaultController";
import { SmartFormInputBaseProps } from "../types";

type SmartFormSegmentedControlProps = SmartFormInputBaseProps &
    SegmentedControlProps &
    Omit<InputWrapperProps, "children"> & {
        backgroundVariant?: "light" | "default";
    };

const WrappedSegmentedControl = forwardRef(
    (props: Omit<SmartFormSegmentedControlProps, "name">, ref) => {
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
            backgroundVariant,
            ...rest
        } = props;
        return (
            <Input.Wrapper
                label={props.label}
                error={props.error}
                required={required}
                description={description}
                descriptionProps={descriptionProps}
                errorProps={errorProps}
                id={id}
                labelElement={labelElement}
                labelProps={labelProps}
                size={props.size}
            >
                <Group grow={props.fullWidth}>
                    <SegmentedControl
                        {...rest}
                        data={props.data}
                        sx={(theme) => ({
                            background:
                                backgroundVariant === "light"
                                    ? theme.colors.dark[7]
                                    : theme.colors.dark[8],
                        })}
                    />
                </Group>
            </Input.Wrapper>
        );
    }
);

WrappedSegmentedControl.displayName = "WrappedSegmentedControl";

export const SmartFormSegmentedControl = (props: SmartFormSegmentedControlProps) => {
    return (
        <SmartFormDefaultController {...props}>
            <WrappedSegmentedControl
                data={props.data}
                backgroundVariant={props.backgroundVariant}
            />
        </SmartFormDefaultController>
    );
};
