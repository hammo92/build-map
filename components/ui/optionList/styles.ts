import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    item: {
        "&:first-of-type": {
            paddingTop: `${theme.spacing.sm}px`,
        },
        display: "flex",
        alignItems: "center",
        marginBottom: theme.spacing.sm,
    },

    itemDragging: {
        //boxShadow: theme.shadows.sm,
        top: `auto !important`,
        left: `auto !important`,
    },

    symbol: {
        fontSize: 30,
        fontWeight: 700,
        width: 60,
    },

    dragHandle: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100%",
        color: theme.colorScheme === "dark" ? theme.colors.dark[1] : theme.colors.gray[6],
        paddingLeft: theme.spacing.md,
        paddingRight: theme.spacing.md,
    },
}));
