import { faEllipsis, faEye, faMemoCircleInfo } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
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
    console.log("contentTemplate.history", contentTemplate.history);
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
                    <Timeline>
                        {contentTemplate.history.map((historyEntry) => (
                            <Timeline.Item
                                key={historyEntry.date}
                                title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
                            >
                                <Stack spacing="sm">
                                    {historyEntry?.propertyUpdate && (
                                        <UpdatedProperty
                                            updatedProperty={historyEntry?.propertyUpdate}
                                            variant="brief"
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
                <Timeline>
                    {contentTemplate.history.map((historyEntry) => (
                        <Timeline.Item
                            key={historyEntry.date}
                            title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
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
