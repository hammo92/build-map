import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    container: {
        border: `1px solid ${theme.colors.dark[5]}`,
        borderRadius: theme.radius.sm,
    },
    actionBar: {
        background: theme.colors.dark[7],
    },
}));
