import { createStyles } from "@mantine/core";

export const useStyles = createStyles((theme, _params, getRef) => ({
    group: {
        //backgroundColor: theme.colors.dark[7],
        //paddingBottom: `${theme.spacing.sm}px`,
    },
    child: {
        ref: getRef("child"),
        display: "flex",
        //padding: `0 ${theme.spacing.sm}px`,
    },
    indent: {
        backgroundColor: theme.colors.dark[5],

        width: "2px",
        margin: `0 ${theme.spacing.sm}px`,
        alignSelf: "stretch",
    },
}));
