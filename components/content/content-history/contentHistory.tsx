import { faEllipsis, faMemoCircleInfo } from "@fortawesome/pro-regular-svg-icons";
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
import { UpdatedProperty } from "./historyEntry";
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
                        {content.history.map((historyEntry) => (
                            <Timeline.Item
                                key={historyEntry.date}
                                title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
                            >
                                {historyEntry?.propertyValuesUpdates?.length ? (
                                    <Stack>
                                        <Text size="sm">
                                            {`Updated Properties: 
                                       ${historyEntry.propertyValuesUpdates
                                           .map((updatedProperty) => {
                                               const field =
                                                   contentFieldsIndexedById[
                                                       updatedProperty.fieldId
                                                   ];
                                               return field?.name ?? "deleted";
                                           })
                                           .join(", ")}`}
                                        </Text>
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

            <Modal opened={opened} onClose={() => setOpened(false)} title="Content History">
                <Timeline>
                    {content.history.map((historyEntry) => (
                        <Timeline.Item
                            key={historyEntry.date}
                            title={`${contentTemplate.name} ${capitalise(historyEntry.action)}`}
                        >
                            {historyEntry?.propertyValuesUpdates?.length ? (
                                <Stack spacing="xs" mt="xs">
                                    {historyEntry.propertyValuesUpdates.map((updatedProperty) => {
                                        const field =
                                            contentFieldsIndexedById[updatedProperty.fieldId];
                                        return (
                                            <UpdatedProperty
                                                key={`${updatedProperty.fieldId}-${historyEntry.date}`}
                                                field={field}
                                                updatedProperty={updatedProperty}
                                            />
                                        );
                                    })}
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
