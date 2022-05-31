import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
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
}));
