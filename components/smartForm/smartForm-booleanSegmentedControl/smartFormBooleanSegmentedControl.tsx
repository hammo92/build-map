import {
    BooleanSegmentedControl,
    BooleanSegmentedControlProps,
} from '@components/ui/booleanSegmentedControl'
import { Group, Input, InputWrapperProps } from '@mantine/core'
import { forwardRef } from 'react'
import { SmartFormController } from '../smartForm-controller'
import { SmartFormInputBaseProps } from '../types'

type SmartFormSegmentedControlProps = SmartFormInputBaseProps &
    BooleanSegmentedControlProps &
    Omit<InputWrapperProps, 'children'> & {
        backgroundVariant?: 'light' | 'default'
    }

const WrappedBooleanSegmentedControl = forwardRef(
    (props: Omit<SmartFormSegmentedControlProps, 'name'>, ref) => {
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
        } = props
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
                    <BooleanSegmentedControl
                        {...rest}
                        sx={(theme) => ({
                            background:
                                backgroundVariant === 'light'
                                    ? theme.colors.dark[7]
                                    : theme.colors.dark[8],
                        })}
                    />
                </Group>
            </Input.Wrapper>
        )
    }
)

WrappedBooleanSegmentedControl.displayName = 'WrappedBooleanSegmentedControl'

export const SmartFormBooleanSegmentedControl = (
    props: SmartFormSegmentedControlProps
) => {
    return (
        <SmartFormController {...props}>
            <WrappedBooleanSegmentedControl
                backgroundVariant={props.backgroundVariant}
            />
        </SmartFormController>
    )
}
