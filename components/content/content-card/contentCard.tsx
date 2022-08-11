import { Content } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Card, Group, Stack, Text } from "@mantine/core";
import { contentState } from "@state/content";
import dayjs from "dayjs";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { ContentStatusBadge } from "../content-status/status-badge";
import { ContentTitle } from "../content-title";
import { useStyles } from "./styles";

interface ContentCardProps {
    content: CleanedCamel<Content>;
    contentTemplate: CleanedCamel<ContentTemplate>;
    active?: boolean;
}

export const ContentCard: FC<ContentCardProps> = ({ content, active, contentTemplate }) => {
    const { contentId } = useSnapshot(contentState);
    const { classes } = useStyles();
    return (
        <Card
            className={`${classes.clickableCard} ${active && classes.active}`}
            onClick={() => (contentState.contentId = content.id)}
        >
            <Card.Section p="md" sx={(theme) => ({ background: theme.colors.dark[7] })}>
                <Group noWrap position="apart">
                    <ContentTitle
                        contentId={content.id}
                        initialData={{
                            content,
                            contentTemplate,
                        }}
                        titleProps={{ order: 4 }}
                    />
                    <ContentStatusBadge status={content.status} />
                </Group>
            </Card.Section>
            <Card.Section p="md">
                <Stack spacing="xs">
                    <Text>last edited: {dayjs(content.lastEditedTime).from(dayjs())}</Text>
                </Stack>
            </Card.Section>
        </Card>
    );
};
