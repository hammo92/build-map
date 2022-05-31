import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme) => ({
    container: {
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[6] : theme.white,
    },
}));
