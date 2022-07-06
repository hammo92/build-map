import { createStyles } from "@mantine/core";
import { hexToRgb } from "utils/colors";

export const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
    },
    delete: {
        position: "absolute",
        right: "5px",
        top: "5px",
    },
    uploadOverlay: {
        position: "absolute",
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        backgroundColor: `rgba(${hexToRgb(theme.colors.dark[8])}, 0.95)`,
    },
    uploadProgressContainer: {
        display: "flex",
        flexDirection: "column",
        height: "100%",
    },
    uploadingText: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
    },
}));
