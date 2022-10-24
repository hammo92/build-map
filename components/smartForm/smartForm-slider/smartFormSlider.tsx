import { Input, InputWrapperProps, Slider, SliderProps } from '@mantine/core'
import { forwardRef } from 'react'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormSliderProps = SmartFormInputBaseProps &
    SliderProps & {
        sliderLabel?: React.ReactNode | ((value: number) => React.ReactNode)
    }

const WrappedSlider = forwardRef(
    (
        props: SliderProps &
            Omit<InputWrapperProps, 'children'> & {
                sliderLabel?:
                    | React.ReactNode
                    | ((value: number) => React.ReactNode)
            },
        ref
    ) => {
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
            sliderLabel,
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
                <Slider {...rest} label={sliderLabel} />
            </Input.Wrapper>
        )
    }
)

WrappedSlider.displayName = 'WrappedSlider'

export const SmartFormSlider = (props: SmartFormSliderProps) => {
    return (
        <SmartFormController {...props}>
            <WrappedSlider />
        </SmartFormController>
    )
}
