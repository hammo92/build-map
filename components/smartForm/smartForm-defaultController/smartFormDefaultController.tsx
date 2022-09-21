import { faQuestionCircle } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Box, Card, Grid, Group, Paper, Stack, Text, Tooltip } from "@mantine/core";
import { debounce } from "debounce";
import React, { useMemo } from "react";
import { Controller, useFormContext } from "react-hook-form";
import { useSmartFormContext } from "../smartForm-context";
import { SmartFormInputBaseProps } from "../types";
interface SmartFormDefaultControllerProps extends SmartFormInputBaseProps {
    value?: any;
    defaultValue?: any;
    defaultChecked?: boolean;
    children: JSX.Element;
    converter?: (value: any) => any;
    hidden?: boolean;
}

export const SmartFormDefaultController = (props: SmartFormDefaultControllerProps) => {
    const input = React.Children.only(props.children);
    const { control, handleSubmit, getValues } = useFormContext();
    const { onSubmit, submitMethod, readOnly } = useSmartFormContext();
    // controller passes value input
    // can't have both value and default value
    // destructure to remove
    const {
        defaultValue,
        defaultChecked,
        value,
        children,
        converter,
        disabled,
        label,
        description,
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
                    <Stack spacing="xs">
                        {!rest.hidden && (
                            <Group position="apart" noWrap>
                                <Text lineClamp={1} sx={{ flexGrow: 1 }} size="sm">
                                    {label}
                                </Text>
                                {description && (
                                    <Tooltip label={description}>
                                        <ActionIcon sx={{ flexShrink: 0 }}>
                                            <FontAwesomeIcon icon={faQuestionCircle} />
                                        </ActionIcon>
                                    </Tooltip>
                                )}
                            </Group>
                        )}
                        {React.createElement(input.type, {
                            ...{
                                ...input.props,
                                ...field,
                                ...rest,
                                ...status,
                                onChange,
                                value: converter ? converter(field.value) : field.value ?? "",
                                disabled: readOnly || props.readOnly || disabled,
                                readOnly: readOnly || props.readOnly || disabled,
                            },
                        })}
                    </Stack>
                );
            }}
        />
    );
};
