import { createStyles } from '@mantine/core'

export const useStyles = createStyles((theme) => ({
    container: {
        background: theme.colors.dark[6],
        flex: '1',
        border: `1px solid ${theme.colors.dark[4]}`,
        borderRadius: `${theme.radius[theme.defaultRadius as 'sm']}px ${
            theme.radius[theme.defaultRadius as 'sm']
        }px 0 0`,
    },
}))
