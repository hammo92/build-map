import { Grid, SimpleGrid } from "@mantine/core";
import React, { FC } from "react";

export const SmartFormFieldGroup: FC<{ cols?: number }> = ({
    children,
    cols,
}) => {
    return (
        <SimpleGrid cols={cols} mb="sm">
            {children}
        </SimpleGrid>
    );
};
