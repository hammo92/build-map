import { MantineThemeOverride } from '@mantine/core'

export const themeOverrides: MantineThemeOverride = {
    colors: {
        dark: [
            '#B7B8C3',
            '#8C8EA2',
            '#6A6D88',
            '#53556E',
            '#40435A',
            '#32344A',
            '#26283D',
            '#1E1F2C',
            '#171821',
            '#121218',
        ],
    },
    spacing: {
        xs: 5,
        sm: 8,
    },
    fontFamilyMonospace: 'relative-mono, Menlo, monospace',
    headings: {
        fontFamily:
            'relative-pro, Roboto, system-ui, -apple-system, BlinkMacSystemFont',
    },
    defaultRadius: 'sm',
    //primaryShade: 8,
    fontFamily:
        'relative-pro, Roboto, system-ui, -apple-system, BlinkMacSystemFont',
    colorScheme: 'dark',
}
