import { useUpdateContentFromTemplate } from "@data/content/hooks";
import { Content } from "@lib/content/data/content.model";
import {
    Box,
    Button,
    Divider,
    Group,
    ScrollArea,
    Stack,
    Text,
    ThemeIcon,
    Timeline,
    Title,
    Tooltip,
} from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { CleanedCamel } from "type-helpers";
import relativeTime from "dayjs/plugin/relativeTime";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faQuestion } from "@fortawesome/pro-regular-svg-icons";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
dayjs.extend(relativeTime);

export const ContentOutdated = ({
    content,
    contentTemplate,
}: {
    content: CleanedCamel<Content>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const { mutateAsync, isLoading } = useUpdateContentFromTemplate();
    return (
        <Stack>
            <Stack>
                <Tooltip
                    label={`The content template for this content entry has been altered since the content was created. Clicking update will update this content entry to match the content template.`}
                    withArrow
                    width={220}
                >
                    <Group position="apart">
                        <Title order={5}>Template Changes</Title>
                        <ThemeIcon variant="outline" radius="xl" color="gray" size="sm">
                            <FontAwesomeIcon icon={faQuestion} />
                        </ThemeIcon>
                    </Group>
                </Tooltip>
                <ScrollArea style={{ maxHeight: 250 }} offsetScrollbars>
                    <Timeline>
                        {content.templateUpdates.map((update) => (
                            <Timeline.Item key={update.version} title={update.updateNotes}>
                                <Text color="dimmed" size="sm">
                                    {dayjs(update.version).from(dayjs())}
                                </Text>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </ScrollArea>
            </Stack>
            <Button
                loading={isLoading}
                disabled={isLoading}
                onClick={() =>
                    mutateAsync({
                        contentId: content.id,
                    })
                }
            >
                Update
            </Button>
        </Stack>
    );
};
