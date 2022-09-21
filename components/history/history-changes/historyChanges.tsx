import { Changes, HistoryEntry } from "@lib/historyEntry/data/historyEntry.model";
import { Anchor, Card, Grid, Group, Modal, Paper, Stack, Table, Text } from "@mantine/core";
import { useState } from "react";

interface HistoryChangesProps {
    changes: HistoryEntry["changes"];
    variant: "slim" | "full";
}

const Changes = ({ changes }: { changes: Changes }) => (
    <Stack spacing="sm">
        {changes.map((change) => (
            <Card style={{ textTransform: "capitalize" }} key={change.path.join()}>
                <Card.Section p="sm" sx={(theme) => ({ background: theme.colors.dark[5] })}>
                    {change.path.join(" -> ")}
                </Card.Section>
                <Card.Section p="sm">
                    <Group>
                        <Stack spacing="xs">
                            <Text>From:</Text>
                            <Text>To:</Text>
                        </Stack>
                        <Stack spacing="xs">
                            <Text>{change.from ? change.from : ""}</Text>
                            <Text>{change.to ? change.to : ""}</Text>
                        </Stack>
                    </Group>
                </Card.Section>
            </Card>
        ))}
    </Stack>
);

export const HistoryChanges = ({ changes, variant }: HistoryChangesProps) => {
    const [opened, setOpened] = useState(false);
    if (!changes) return null;
    if (variant === "slim")
        return (
            <>
                {changes.length && (
                    <Anchor onClick={() => setOpened(true)} size="sm">
                        View Changes
                    </Anchor>
                )}
                <Modal opened={opened} onClose={() => setOpened(false)} title="Changes">
                    <Changes changes={changes} />
                </Modal>
            </>
        );
    return (
        <div style={{ marginTop: "5px" }}>
            <Changes changes={changes} />
        </div>
    );
};
