import { Grid, SimpleGrid } from "@mantine/core";
import React, { FC, ReactNode } from "react";

interface SmartFormFieldGroupProps {
    cols?: number;
    children: ReactNode;
}

export const SmartFormFieldGroup = ({ children, cols }: SmartFormFieldGroupProps) => {
    return <SimpleGrid cols={cols}>{children}</SimpleGrid>;
};
