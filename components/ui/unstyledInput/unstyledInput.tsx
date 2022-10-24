import { useUncontrolled } from '@mantine/hooks'
import { useStyles } from './styles'
import React from 'react'

export const UnstyledInput = ({
    value,
    onChange,
    defaultValue,
    width = 'full',
}: {
    value?: string
    onChange?: (value: string) => void
    defaultValue?: string
    width?: 'fit' | 'full' | number | string
}) => {
    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: '',
        onChange,
    })
    const { classes } = useStyles({ width, stringLength: _value.length })

    return (
        <input
            type="text"
            onChange={(event) => handleChange(event.currentTarget.value)}
            value={_value}
            className={classes.unstyled}
        />
    )
}
