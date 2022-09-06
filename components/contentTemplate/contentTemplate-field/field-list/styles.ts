import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    indentation: {
        width: "20px",
        display: "block",
        alignSelf: "stretch",
        backgroundImage: ` linear-gradient(90deg, transparent 11px, 11px, rgba(244, 244, 244, 0.15) 13px, transparent 13px)`,
    },
}));
