import { Box, Group } from "@mantine/core";
import React, { FC } from "react";
import { useStyles } from "./styles";

export interface HeaderProps {
    title?: string;
}

export const Header: FC<HeaderProps> = ({ title }) => {
    const { classes } = useStyles();
    return <Group className={classes.header}>{title}</Group>;
};
