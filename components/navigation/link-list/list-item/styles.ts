import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    button: {
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
        paddingBottom: 0,

        display: "flex",
        flexDirection: "column",
    },
}));
