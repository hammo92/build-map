import { UserAvatar } from "@components/user/user-avatar";
import { useGetUsers } from "@data/user/hooks";
import { faEllipsis, faEye, faMemoCircleInfo } from "@fortawesome/pro-regular-svg-icons";
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
import { UpdatedProperty } from "./updatedProperty";
dayjs.extend(relativeTime);

export const ContentTemplateHistory = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const [opened, setOpened] = useState(false);
    // get all unique user values from updates
    const updatingUsers = Array.from(
        new Set(
            contentTemplate.history.reduce<string[]>((acc, entry) => {
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
                        {contentTemplate.history.map((historyEntry) => (
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
                                <Stack spacing="sm">
                                    {historyEntry?.propertyUpdate && (
                                        <UpdatedProperty
                                            updatedProperty={historyEntry?.propertyUpdate}
                                            variant="compact"
                                        />
                                    )}
                                    {historyEntry?.updateNotes?.length &&
                                        historyEntry?.updateNotes.map((note) => (
                                            <Text size="sm" key={note}>
                                                {note}
                                            </Text>
                                        ))}
                                </Stack>

                                <Text color="dimmed" size="sm">
                                    {dayjs(historyEntry.date).from(dayjs())}
                                </Text>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </ScrollArea.Autosize>
            </Stack>

            <Modal opened={opened} onClose={() => setOpened(false)} title="Content History">
                <Timeline bulletSize={24}>
                    {contentTemplate.history.map((historyEntry) => (
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
                            <Stack spacing="sm">
                                {historyEntry?.propertyUpdate && (
                                    <UpdatedProperty
                                        updatedProperty={historyEntry?.propertyUpdate}
                                        variant="full"
                                    />
                                )}
                                {historyEntry?.updateNotes?.length &&
                                    historyEntry?.updateNotes.map((note) => (
                                        <Text size="sm" key={note}>
                                            {note}
                                        </Text>
                                    ))}
                            </Stack>

                            <Text color="dimmed" size="sm">
                                {dayjs(historyEntry.date).from(dayjs())}
                            </Text>
                        </Timeline.Item>
                    ))}
                </Timeline>
            </Modal>
        </>
    );
};
