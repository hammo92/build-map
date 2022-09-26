import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    clickableCard: {
        textAlign: "center",
        cursor: "pointer",
        transition: "all 0.3s",
        display: "flex",
        alignItems: "center",
        "&:hover": {
            background: theme.colors.dark[5],
        },
    },
}));
