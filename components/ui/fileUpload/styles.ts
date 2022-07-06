import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    wrapper: {
        position: "relative",
        //marginBottom: 30,
        background: theme.colors.dark[5],
        borderRadius: theme.radius.sm,
        border: `1px solid ${theme.colors.dark[5]}`,
        //paddingBottom: 30,
    },

    dropzone: {
        borderWidth: 0,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
    },
    icon: {
        color: theme.colorScheme === "dark" ? theme.colors.dark[3] : theme.colors.gray[4],
    },

    control: {
        position: "absolute",
        width: 250,
        left: "calc(50% - 125px)",
        bottom: -20,
    },
}));
