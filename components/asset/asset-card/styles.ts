import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
    },
    card: {
        background: theme.colors.dark[7],
    },
    checkbox: {
        position: "absolute",
        left: "5px",
        top: "5px",
        shadow: theme.shadows.sm,
    },
}));
