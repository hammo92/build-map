import { Button, Group, Title } from "@mantine/core";
import React, { FC } from "react";

interface PageHeaderProps {
    title: string;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, children }) => {
    return (
        <Group
            px="md"
            direction="row"
            position="apart"
            sx={{ minHeight: "76px" }}
        >
            <Title order={3}>{title}</Title>
            <Group>{children}</Group>
        </Group>
    );
};
