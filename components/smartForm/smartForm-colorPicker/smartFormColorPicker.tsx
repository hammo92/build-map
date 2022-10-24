import {
    ColorPicker,
    ColorPickerProps,
    Input,
    InputWrapperProps,
} from '@mantine/core'
import { forwardRef } from 'react'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormColorPickerProps = SmartFormInputBaseProps &
    ColorPickerProps &
    Omit<InputWrapperProps, 'children'>

const WrappedColorPicker = forwardRef(
    (props: ColorPickerProps & Omit<InputWrapperProps, 'children'>, ref) => {
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
        } = props
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
                sx={{ display: 'flex', flexDirection: 'column' }}
            >
                <ColorPicker {...rest} />
            </Input.Wrapper>
        )
    }
)

WrappedColorPicker.displayName = 'WrappedColorPicker'

export const SmartFormColorPicker = (props: SmartFormColorPickerProps) => {
    return (
        <SmartFormController {...props}>
            <WrappedColorPicker />
        </SmartFormController>
    )
}
