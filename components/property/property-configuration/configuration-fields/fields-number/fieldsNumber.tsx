import { SmartForm } from '@components/smartForm'
import { Checkbox, Group, NumberInputProps, Stack } from '@mantine/core'
import { useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { capitalise, splitCamel } from 'utils/stringTransform'

interface ValueLimiterProps extends NumberInputProps {
    limitType: 'maximumValue' | 'minimumValue'
}

const ValueLimiter = (props: ValueLimiterProps) => {
    const { limitType, ...rest } = props
    const { getValues, setValue } = useFormContext()
    const [active, setActive] = useState(getValues(limitType))
    return (
        <Stack spacing="sm">
            <Checkbox
                checked={active}
                onChange={(event) => {
                    const { checked } = event.currentTarget
                    setActive(checked)
                    !checked && setValue(limitType, undefined)
                }}
                label={`${capitalise(splitCamel(limitType))}`}
            />
            <SmartForm.NumberInput
                name={limitType}
                {...rest}
                disabled={!active}
            />
        </Stack>
    )
}

export const FieldsNumber = () => {
    const { watch } = useFormContext()
    const variant = watch('variant')
    const precision = () => {
        switch (variant) {
            case 'integer':
                return 0
            case 'decimal':
                return 2
            case 'float':
                return 10
        }
    }
    const min = watch('minimumValue')
    const max = watch('maximumValue')

    // remove insignificant trailing zeroes from float
    //! Currently strips all trailing zeroes, need solution
    //Todo improve formatter to run on blur
    const formatter = (value: string | undefined) => {
        if (value) {
            if (variant === 'float' && value.split('.')?.[1]?.length > 1) {
                return parseFloat(value).toString()
            } else {
                return value
            }
        }
        return '0'
    }
    return (
        <SmartForm.FieldGroup cols={2}>
            <ValueLimiter
                max={max}
                precision={precision()}
                formatter={formatter}
                limitType="minimumValue"
            />
            <ValueLimiter
                min={min}
                precision={precision()}
                formatter={formatter}
                limitType="maximumValue"
            />
        </SmartForm.FieldGroup>
    )
}
