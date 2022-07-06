import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    slider: {
        webkitAppearance: "none" /* Override default CSS styles */,
        appearance: "none",
        width: "100%",
        height: "8px",
        outline: "none",
        background: theme.colors.dark[6],
        transition: "opacity 0.3s",
        borderRadius: "4px",
        "&:hover": {},
        "&::-webkit-slider-thumb": {
            webkitAppearance: "none" /* Override default CSS styles */,
            appearance: "none",
            cursor: "pointer",
            width: "15px",
            height: "15px",
            background: theme.colors.blue[7],
        },
        "&::-moz-range-thumb": {
            webkitAppearance: "none" /* Override default CSS styles */,
            appearance: "none",
            cursor: "pointer",
            width: "8px",
            height: "8px",
            border: `4px solid ${theme.colors.gray[0]}`,
            background: theme.colors.blue[7],
        },
        "&::-ms-fill-lower": {
            background: theme.colors.blue[7],
            height: "8px",
            borderRadius: "4px",
        },
        "&::-ms-fill-upper": {
            background: theme.colors.dark[6],
            height: "8px",
            borderRadius: "4px",
        },
        "&::-moz-range-progress": {
            background: theme.colors.blue[7],
            height: "8px",
            borderRadius: "4px",
        },
        "&::-moz-range-track": {
            background: theme.colors.dark[6],
            height: "8px",
            borderRadius: "4px",
        },
    },
}));
