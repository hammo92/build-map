import { Group } from "@mantine/core";
import React from "react";
import { RotateButton } from "./rotate-button";

export const RotateInterface = () => {
    return (
        <Group
            grow
            sx={(theme) => ({
                flex: "1",
                padding: theme.spacing.sm,
            })}
        >
            <RotateButton angle={-90} />
            <RotateButton angle={90} />
        </Group>
    );
};
