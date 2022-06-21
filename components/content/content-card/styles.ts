import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    clickableCard: {
        cursor: "pointer",
        transition: "all 0.3s",
        background: theme.colors.dark[6],
        border: `2px solid ${theme.colors.dark[6]}`,
        "&:hover": {
            background: theme.colors.dark[5],
        },
    },
    active: {
        border: `2px solid ${theme.colors.violet[8]}`,
    },
}));
