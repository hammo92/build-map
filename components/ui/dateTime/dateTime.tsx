import {
    extractSystemStyles,
    Group,
    Input,
    InputWrapperProps,
    Text,
} from '@mantine/core'
import {
    DatePicker,
    DatePickerProps,
    TimeInput,
    TimeInputProps,
} from '@mantine/dates'
import { useId, useUncontrolled } from '@mantine/hooks'
import dayjs from 'dayjs'
import { forwardRef } from 'react'

export type DateTimeProps = Omit<InputWrapperProps, 'children'> & {
    DateProps?: Omit<DatePickerProps, 'onChange'>
    TimeProps?: Omit<TimeInputProps, 'onChange'>
    /** Selected date, required with controlled input */
    value?: Date

    /** Called when date changes */
    onChange?(value: Date | null): void

    /** Default value for uncontrolled input */
    defaultValue?: Date | null

    disabled?: boolean
}

export const DateTime = forwardRef<HTMLInputElement, DateTimeProps>(
    (props, ref) => {
        const {
            value,
            defaultValue,
            onChange,
            required,
            style,
            label,
            id,
            error,
            description,
            size,
            onBlur,
            onFocus,
            className,
            classNames,
            styles,
            disabled,
            sx,
            errorProps,
            descriptionProps,
            labelProps,
            placeholder,
            ...others
        } = props
        const [_value, setValue] = useUncontrolled<Date>({
            value,
            defaultValue,
            finalValue: undefined,
            onChange: onChange!,
        })
        const { systemStyles, rest } = extractSystemStyles(others)
        const uuid = useId(id)

        const handleChange = (date: Date, type: 'date' | 'time') => {
            const current = dayjs(_value).isValid() ? dayjs(_value) : dayjs()
            const parsed = dayjs(date)
            if (type === 'time') {
                setValue(
                    current.hour(parsed.hour()).minute(parsed.minute()).toDate()
                )
            }
            if (type === 'date') {
                setValue(
                    current
                        .year(parsed.year())
                        .month(parsed.month())
                        .date(parsed.date())
                        .toDate()
                )
            }
        }

        return (
            <Input.Wrapper
                required={required}
                id={uuid}
                label={label}
                error={error}
                description={description}
                size={size}
                className={className}
                style={style}
                classNames={classNames}
                styles={styles}
                __staticSelector="Select"
                sx={sx}
                errorProps={errorProps}
                descriptionProps={descriptionProps}
                labelProps={labelProps}
                {...systemStyles}
            >
                <Group spacing="sm">
                    <DatePicker
                        onChange={(date) => date && handleChange(date, 'date')}
                        disabled={disabled}
                        value={_value}
                        inputFormat="DD/MM/YYYY"
                        clearable={false}
                        required={required}
                        {...props.DateProps}
                        sx={{ flex: 1 }}
                    />
                    <Text size="sm" color="dimmed">
                        at
                    </Text>
                    <TimeInput
                        onChange={(date) => date && handleChange(date, 'time')}
                        value={_value}
                        disabled={disabled}
                        required={required}
                        {...props.TimeProps}
                        sx={{ flex: 1 }}
                    />
                </Group>
            </Input.Wrapper>
        )
    }
)

DateTime.displayName = 'DateTime'
