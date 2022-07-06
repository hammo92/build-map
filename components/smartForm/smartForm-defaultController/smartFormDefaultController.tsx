import { Box, Group, Text } from "@mantine/core";
import { useDebouncedValue } from "@mantine/hooks";
import React, { useEffect, useMemo, useRef, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSmartFormContext } from "../smartForm-context";
import { SmartFormInputBaseProps } from "../types";
import { debounce } from "debounce";
interface SmartFormDefaultControllerProps extends SmartFormInputBaseProps {
    value?: any;
    defaultValue?: any;
    defaultChecked?: boolean;
    children: JSX.Element;
    converter?: (value: any) => any;
}

export const SmartFormDefaultController = (props: SmartFormDefaultControllerProps) => {
    const input = React.Children.only(props.children);
    const { control, handleSubmit, getValues } = useFormContext();
    const { onSubmit, submitMethod } = useSmartFormContext();
    // controller passes value input
    // can't have both value and default value
    // destructure to remove
    const {
        defaultValue,
        defaultChecked,
        value,
        children,
        converter,
        //label,
        //description,
        ...rest
    } = props;

    const debouncedChangeHandler = useMemo(
        () => debounce(() => handleSubmit(onSubmit)(), 500),
        [handleSubmit, onSubmit]
    );

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
                const onChange = (...event: any[]) => {
                    if (submitMethod === "onChange") {
                        debouncedChangeHandler();
                    }
                    field.onChange(...event);
                };
                //? Workaround for Mantine Error //
                // mantine error accepts string or true but console error on false
                // avoid false by conditionally create error object to be spread in component
                //? //
                const status = {
                    ...(error &&
                        (error?.message?.length
                            ? { error: error.message }
                            : { error: error.type })),
                };
                return (
                    // <Box sx={{ display: "flex" }}>
                    //     <Group sx={{ width: "160px" }} py="xs" direction="column" spacing={0}>
                    //         <Text lineClamp={1}>{label}</Text>
                    //         {description && (
                    //             <Text color="dimmed" size="sm">
                    //                 {description}
                    //             </Text>
                    //         )}
                    //     </Group>
                    //     <Box sx={{ flexGrow: 1 }}>
                    React.createElement(input.type, {
                        ...{
                            ...input.props,
                            ...field,
                            onChange,
                            value: converter ? converter(field.value) : field.value,
                            ...rest,
                            ...status,
                        },
                    })
                    // </Box>
                    // </Box>
                );
            }}
        />
    );
};
