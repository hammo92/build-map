import { createStyles } from '@mantine/core'

export const useStyles = createStyles(
    (
        theme,
        {
            width,
            stringLength,
        }: { width: 'fit' | 'full' | number | string; stringLength: number }
    ) => ({
        unstyled: {
            background: 'none',
            border: 'none',
            color: theme.colors.gray[1],
            fontFamily: theme.fontFamilyMonospace,
            fontSize: theme.fontSizes.sm,
            width:
                width === 'fit'
                    ? `${stringLength + 0.5}ch`
                    : width === 'full'
                    ? '100%'
                    : typeof width === 'number'
                    ? `${width}px`
                    : width,
            flexGrow: width === 'full' ? 1 : 0,
            flexShrink: width === 'fit' ? 0 : 1,
            flexBasis: 1,
            '&:focus': {
                outline: 'none',
                boxShadow: 'none',
            },
            '&:focus-visible': {
                outline: 'none',
                boxShadow: 'none',
            },
        },
    })
)
