import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    transition: {
        transition: "all 0.3s",
    },
    clickable: {
        cursor: "pointer",
        transition: "all 0.3s",
    },
    activeSwatch: {
        opacity: 0.5,
    },
}));
