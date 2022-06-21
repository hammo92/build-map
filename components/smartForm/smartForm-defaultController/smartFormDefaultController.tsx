import React from "react";
import { Controller, useFormContext } from "react-hook-form";
import { SmartFormInputBaseProps } from "../types";

interface SmartFormDefaultControllerProps extends SmartFormInputBaseProps {
    value?: any;
    defaultValue?: any;
    defaultChecked?: boolean;
    children: JSX.Element;
}

export const SmartFormDefaultController = (props: SmartFormDefaultControllerProps) => {
    const input = React.Children.only(props.children);
    const { control, getFieldState, register } = useFormContext();
    // controller passes value input
    // can't have both value and default value
    // destructure to remove
    const { defaultValue, defaultChecked, value, children, ...rest } = props;
    return (
        <Controller
            name={props.name}
            control={control}
            defaultValue={value ?? defaultValue ?? defaultChecked}
            rules={{
                required: props.required,
                ...props.rules,
            }}
            render={({ field, fieldState }) => {
                const { error } = fieldState;
                //? Workaround for Mantine Error //
                // mantine error accepts string or true but console error on false
                // avoid false by conditionally create error object to be spread in component
                //? //
                const status = {
                    ...(error && (error?.message?.length ? { error: error.message } : { error: error.type })),
                };
                return React.createElement(input.type, {
                    ...{
                        ...input.props,
                        ...field,
                        ...rest,
                        ...status,
                    },
                });
            }}
        />
    );
};
