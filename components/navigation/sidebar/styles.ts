import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    navbar: {
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,

        display: "flex",
        flexDirection: "column",
    },

    header: {
        padding: theme.spacing.md,
        minHeight: "76px",
        color: theme.colorScheme === "dark" ? theme.white : theme.black,
        // borderBottom: `1px solid ${
        //     theme.colorScheme === "dark"
        //         ? theme.colors.dark[4]
        //         : theme.colors.gray[3]
        // }`,
    },

    logo: {
        height: "100%",
    },

    content: { padding: theme.spacing.sm, paddingTop: "0px" },

    footer: {
        borderTop: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[4]
                : theme.colors.gray[3]
        }`,
    },
}));
