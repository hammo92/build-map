import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    swiperContainer: {
        height: "100%",
        maxHeight: "100vw",
        minHeight: 0,
        minWwidth: 0,
        maxWwidth: "100vw",
        width: "100%",
        overflow: "hidden",
    },

    swiperSlide: {
        width: "auto",
        flexShrink: 0,
        display: "block",
        height: "100%",
        maxHeight: "100%",
    },

    swiperWrapper: {
        maxHeight: "100%",
        height: "100%",
        display: "flex",
        position: "absolute",
    },
}));
