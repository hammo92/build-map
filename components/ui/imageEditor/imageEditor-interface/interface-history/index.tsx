import { Group } from "@mantine/core";
import React from "react";
import { DeleteButton } from "./history-deleteButton";
import { RedoButton } from "./history-redoButton";
import { UndoButton } from "./history-undoButton";

export const HistoryInterface = () => {
    return (
        <Group
            spacing="xs"
            sx={(theme) => ({
                padding: theme.spacing.sm,
            })}
        >
            <UndoButton />
            <RedoButton />
            <DeleteButton />
        </Group>
    );
};
