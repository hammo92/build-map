import { Group } from "@mantine/core";
import React from "react";
import { CropActions } from "./crop-actions";
import { CropRatioSelect } from "./crop-ratio-select";

export const CropInterface = () => {
    return (
        <Group
            sx={(theme) => ({
                flex: "1",
                padding: theme.spacing.sm,
            })}
            position="apart"
        >
            <Group>
                <CropRatioSelect />
            </Group>
            <CropActions />
        </Group>
    );
};
