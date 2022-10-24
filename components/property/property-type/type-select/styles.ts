import { createStyles } from '@mantine/core'

interface TypeCardProps {
    disabled: boolean
}

export const useStyles = createStyles((theme, { disabled }: TypeCardProps) => ({
    clickableCard: {
        textAlign: 'center',
        cursor: 'pointer',
        transition: 'all 0.3s',
        display: 'flex',
        alignItems: 'center',
        opacity: disabled ? 0.6 : 1,
        pointerEvents: disabled ? 'none' : 'all',
        '&:hover': {
            background: disabled ? theme.colors.dark[6] : theme.colors.dark[5],
        },
    },
}))
