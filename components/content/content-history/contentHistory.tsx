import { UserAvatar } from "@components/user/user-avatar";
import { useGetUsers } from "@data/user/hooks";
import { faMemoCircleInfo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { StrippedUser } from "@lib/user/data";
import { ActionIcon, Group, Modal, ScrollArea, Stack, Text, Timeline, Title } from "@mantine/core";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { useState } from "react";
import { CleanedCamel } from "type-helpers";
import { capitalise } from "utils/stringTransform";
import { HistoryEntry } from "./history-entry";
dayjs.extend(relativeTime);

export const ContentHistory = ({
    content,
    contentTemplate,
}: {
    content: CleanedCamel<Content>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const [opened, setOpened] = useState(false);

    const contentFieldsIndexedById = content.fields.reduce<{ [fieldId: string]: ContentField }>(
        (acc, curr) => {
            return { ...acc, [curr.id]: curr };
        },
        {}
    );

    // get all unique user values from updates
    const updatingUsers = Array.from(
        new Set(
            content.history.reduce<string[]>((acc, entry) => {
                acc.push(entry.userId);
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
                        {content.history.map((historyEntry) => (
                            <Timeline.Item
                                key={historyEntry.date}
                                title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
                                bullet={
                                    users[historyEntry.userId] && (
                                        <UserAvatar
                                            user={users[historyEntry.userId]}
                                            radius="xl"
                                            size={22}
                                        />
                                    )
                                }
                            >
                                {historyEntry?.contentUpdates?.length ? (
                                    <Stack spacing="sm">
                                        <HistoryEntry
                                            fieldMap={contentFieldsIndexedById}
                                            contentUpdates={historyEntry.contentUpdates}
                                            variant={"compact"}
                                        />
                                    </Stack>
                                ) : (
                                    ""
                                )}
                                <Text color="dimmed" size="sm">
                                    {dayjs(historyEntry.date).from(dayjs())}
                                </Text>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </ScrollArea.Autosize>
            </Stack>

            <Modal
                opened={opened}
                size="xl"
                onClose={() => setOpened(false)}
                title="Content History"
            >
                <Timeline bulletSize={24}>
                    {content.history.map((historyEntry) => (
                        <Timeline.Item
                            key={historyEntry.date}
                            title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
                            bullet={
                                users[historyEntry.userId] && (
                                    <UserAvatar
                                        user={users[historyEntry.userId]}
                                        radius="xl"
                                        size={22}
                                    />
                                )
                            }
                        >
                            {historyEntry?.contentUpdates?.length ? (
                                <Stack spacing="sm">
                                    <HistoryEntry
                                        fieldMap={contentFieldsIndexedById}
                                        contentUpdates={historyEntry.contentUpdates}
                                        variant={"full"}
                                    />
                                </Stack>
                            ) : (
                                ""
                            )}
                            <Text color="dimmed" size="xs">
                                {dayjs(historyEntry.date).from(dayjs())}
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Modal>
        </>
    );
};
