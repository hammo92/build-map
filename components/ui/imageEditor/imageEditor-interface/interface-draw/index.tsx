import { Group } from "@mantine/core";
import React from "react";
import { BrushColor } from "./draw-brush-color";
import { BrushWidth } from "./draw-brush-width";
import { BrushSelect } from "./draw-select";

export const DrawInterface = () => {
    return (
        <Group
            sx={(theme) => ({
                flex: "1",
                padding: theme.spacing.sm,
            })}
            position="apart"
        >
            <Group>
                <BrushSelect />
            </Group>
            <Group>
                <BrushColor />
                <BrushWidth />
            </Group>
        </Group>
    );
};
