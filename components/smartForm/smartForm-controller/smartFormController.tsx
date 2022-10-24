import { Grid, Group, SimpleGrid, Stack } from '@mantine/core'
import { debounce } from 'debounce'
import React, { useMemo } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { useSmartFormContext } from '../smartForm-context'
import { SmartFormInputBaseProps } from '../types'
import { ControllerLabel } from '@components/smartForm/smartForm-controller/controller-label/controllerLabel'
import { variance } from '@babel/types'

export interface SmartFormDefaultControllerProps
    extends SmartFormInputBaseProps {
    value?: any
    defaultValue?: any
    defaultChecked?: boolean
    children: JSX.Element
    converter?: (value: any) => any
    hidden?: boolean
    onChange?: (value: any) => any
    view?: 'checkbox' | 'default' | 'inline'
}

export const SmartFormController = (props: SmartFormDefaultControllerProps) => {
    const input = React.Children.only(props.children)
    const { control, handleSubmit, getValues } = useFormContext()
    const { onSubmit, submitMethod, readOnly } = useSmartFormContext()

    const {
        defaultValue,
        defaultChecked,
        value,
        children,
        converter,
        disabled,
        label,
        description,
        onChange,
        rightContent,
        view = 'default',
        ...rest
    } = props

    // used if submit type is onChange
    const debouncedChangeHandler = useMemo(
        () => debounce(() => handleSubmit(onSubmit)(), 500),
        [handleSubmit, onSubmit]
    )
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
                const { error } = fieldState
                const handleChange = async (...event: any[]) => {
                    if (submitMethod === 'onChange') {
                        await debouncedChangeHandler()
                    }
                    field.onChange(...event)
                }

                //? Workaround for Mantine Error //
                // mantine error accepts string or true but console error on false
                // avoid false by conditionally create error object to be spread in component
                //? //
                const status = {
                    ...(error &&
                        (error?.message?.length
                            ? { error: error.message }
                            : { error: error.type })),
                }

                const controllerElement = React.createElement(input.type, {
                    ...{
                        ...input.props,
                        ...field,
                        ...rest,
                        ...status,
                        // if an onChange function is passed to controller run the function first
                        onChange: (val: any) =>
                            onChange
                                ? handleChange(onChange(val))
                                : handleChange(val),
                        value: converter
                            ? converter(field.value)
                            : field.value ?? '',
                        disabled: readOnly || disabled,
                        readOnly: readOnly || disabled,
                    },
                })

                if (rest.hidden) return <></>

                if (view === 'checkbox') {
                    return (
                        <Group>
                            {controllerElement}
                            <div style={{ flex: '1' }}>
                                <ControllerLabel
                                    label={label}
                                    rightContent={rightContent}
                                    required={rest.required}
                                    description={description}
                                />
                            </div>
                        </Group>
                    )
                }
                if (view === 'inline') {
                    return (
                        <Grid align="center">
                            <Grid.Col span={2}>
                                <ControllerLabel
                                    label={label}
                                    required={rest.required}
                                    description={description}
                                />
                            </Grid.Col>
                            <Grid.Col span={10}>
                                <Group>
                                    <div style={{ flex: '1' }}>
                                        {controllerElement}
                                    </div>
                                    <div style={{ flex: '0' }}>
                                        {rightContent}
                                    </div>
                                </Group>
                            </Grid.Col>
                        </Grid>
                    )
                }
                return (
                    <Stack spacing="xs">
                        <ControllerLabel
                            label={label}
                            rightContent={rightContent}
                            required={rest.required}
                            description={description}
                        />
                        {controllerElement}
                    </Stack>
                )
            }}
        />
    )
}
