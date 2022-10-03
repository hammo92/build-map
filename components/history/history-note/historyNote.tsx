import { Note } from "@lib/historyEntry/data/historyEntry.model";
import { Card, List, Text } from "@mantine/core";
import React from "react";

export const HistoryNote = ({ note }: { note: Note }) => {
    return (
        <Card p="xs" sx={(theme) => ({ background: theme.colors.dark[7] })}>
            <Text size="sm">{note.title}</Text>
            <Text size="sm">{note.subtitle}</Text>
            <List size="sm">
                {note.entries?.map((entry, i) =>
                    typeof entry === "string" ? (
                        <List.Item key={entry + i}>{entry}</List.Item>
                    ) : (
                        <HistoryNote note={entry} />
                    )
                )}
            </List>
        </Card>
    );
};
