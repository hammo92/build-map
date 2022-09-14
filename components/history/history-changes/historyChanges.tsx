import { Change, Changes, HistoryEntry } from "@lib/historyEntry/data/historyEntry.model";
import { Box, Group, Stack, Text } from "@mantine/core";
import { objectTraps } from "immer/dist/internal";
import React from "react";
import { isObject } from "utils/objects";

interface HistoryChangesProps {
    changes: HistoryEntry["changes"];
}

const parseChanges = (changes: Changes) => {
    if (!isObject(changes)) return;
    return Object.keys(changes).map((key) => {
        if (changes[key]?.from || changes[key]?.to) {
            return (
                <Group key={key}>
                    <Text>{key}</Text>
                    <Text>From:{changes[key]?.from ?? "Not Set"}</Text>
                    <Text>To:{changes[key]?.to ?? "Not Set"}</Text>
                </Group>
            );
        }
        console.log("changes[key]", changes[key]);
        return (
            <Group key={key}>
                <>
                    <Text>{key}</Text>
                    {parseChanges(changes[key] as Changes)}
                </>
            </Group>
        );
    });
};

export const HistoryChanges = ({ changes }: HistoryChangesProps) => {
    if (!changes) return null;
    console.log("changes :>> ", changes);
    const changeElements = parseChanges(changes);
    return <Stack>{changeElements}</Stack>;
};
