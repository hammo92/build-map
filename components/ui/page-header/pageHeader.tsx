import { Button, Group, Title } from "@mantine/core";
import React, { FC } from "react";

interface PageHeaderProps {
    title: string;
    children?: React.ReactNode;
}

export const PageHeader: FC<PageHeaderProps> = ({ title, children }) => {
    return (
        <Group px="md" position="apart" sx={{ minHeight: "76px" }}>
            <Title order={3}>{title}</Title>
            <Group>{children}</Group>
        </Group>
    );
};
