import { UserAvatar } from "@components/user/user-avatar";
import { useGetUsers } from "@data/user/hooks";
import { faMemoCircleInfo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { HistoryEntry } from "@lib/historyEntry/data/historyEntry.model";
import { StrippedUser } from "@lib/user/data";
import {
    ActionIcon,
    Group,
    List,
    Modal,
    ScrollArea,
    Stack,
    Text,
    Timeline,
    Title,
} from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { CleanedCamel } from "type-helpers";
import { HistoryChanges } from "./history-changes";
dayjs.extend(relativeTime);

export const History = ({ historyEntries }: { historyEntries: HistoryEntry[] }) => {
    const [opened, setOpened] = useState(false);

    // get all unique user values from updates
    const updatingUsers = Array.from(
        new Set(
            historyEntries.reduce<string[]>((acc, entry) => {
                acc.push(entry.editedBy);
                return acc;
            }, [])
        )
    );

    const userQueries = useGetUsers({ userIdentifiers: updatingUsers });

    const users = userQueries.reduce<{ [id: string]: CleanedCamel<StrippedUser> }>((acc, query) => {
        if (query?.data?.data?.user) {
            const user: { [id: string]: CleanedCamel<StrippedUser> } = {
                [query.data.data.user.id]: query.data.data.user,
            };
            return { ...acc, ...user };
        } else return acc;
    }, {});

    /*const changes = (historyEntry: HistoryEntry) => {
        if (!historyEntry.changes) return null;
        Object.keys(historyEntry.changes).map(key => {
            const item =  h
        })
    }*/

    return (
        <>
            <Stack align="stretch">
                <Group position="apart">
                    <Title order={5}>History</Title>
                    <ActionIcon onClick={() => setOpened(true)} color="grape" variant="light">
                        <FontAwesomeIcon icon={faMemoCircleInfo} />
                    </ActionIcon>
                </Group>
                <ScrollArea.Autosize maxHeight={250} offsetScrollbars>
                    <Timeline bulletSize={24}>
                        {historyEntries.map((historyEntry) => (
                            <Timeline.Item
                                key={historyEntry.editedTime}
                                title={historyEntry.title}
                                bullet={
                                    users[historyEntry.editedBy] && (
                                        <UserAvatar
                                            user={users[historyEntry.editedBy]}
                                            radius="xl"
                                            size={22}
                                        />
                                    )
                                }
                            >
                                {!!historyEntry.subtitle && (
                                    <Text size="sm">{historyEntry.subtitle}</Text>
                                )}
                                <List size="sm">
                                    {historyEntry?.notes?.length &&
                                        historyEntry?.notes.map((note) => (
                                            <List.Item key={note}>{note}</List.Item>
                                        ))}
                                </List>
                                <HistoryChanges changes={historyEntry.changes} variant="slim" />
                                <Text color="dimmed" size="sm">
                                    {dayjs(historyEntry.editedTime).from(dayjs())}
                                </Text>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </ScrollArea.Autosize>
            </Stack>

            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Content Template History"
            >
                <Timeline bulletSize={24}>
                    {historyEntries.map((historyEntry) => (
                        <Timeline.Item
                            key={historyEntry.editedTime}
                            title={historyEntry.title}
                            bullet={
                                users[historyEntry.editedBy] && (
                                    <UserAvatar
                                        user={users[historyEntry.editedBy]}
                                        radius="xl"
                                        size={22}
                                    />
                                )
                            }
                        >
                            {!!historyEntry.subtitle && (
                                <Text size="sm">{historyEntry.subtitle}</Text>
                            )}
                            <List size="sm">
                                {historyEntry?.notes?.length &&
                                    historyEntry?.notes.map((note) => (
                                        <List.Item key={note}>{note}</List.Item>
                                    ))}
                            </List>
                            <HistoryChanges changes={historyEntry.changes} variant="full" />
                            <Text color="dimmed" size="sm">
                                {dayjs(historyEntry.editedTime).from(dayjs())}
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Modal>
        </>
    );
};
