import { Content } from "@lib/content/data/content.model";
import { Badge, Card, Group, Text } from "@mantine/core";
import { contentState } from "@state/content";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { useStyles } from "./styles";

interface ContentCardProps {
    content: CleanedCamel<Content>;
}

export const ContentCard: FC<ContentCardProps> = ({ content }) => {
    const { contentId } = useSnapshot(contentState);
    const { classes } = useStyles();
    return (
        <Card
            className={`${classes.clickableCard} ${
                contentId === content.id && classes.active
            }`}
            onClick={() => (contentState.contentId = content.id)}
        >
            <Card.Section
                p="md"
                sx={(theme) => ({ background: theme.colors.dark[7] })}
            >
                <Group position="apart" noWrap>
                    <Group noWrap>
                        <Text size="lg" lineClamp={1}>
                            {content.id}
                        </Text>
                    </Group>
                    <Badge
                        sx={{ flexShrink: 0 }}
                        color={
                            content.status === "published" ? "violet" : "blue"
                        }
                        variant={
                            content.status === "published"
                                ? "filled"
                                : "outline"
                        }
                    >
                        {content.status}
                    </Badge>
                </Group>
            </Card.Section>
            <Card.Section p="md">
                <Group direction="column" grow spacing="xs">
                    <Text>{`${content.fields.length} fields`}</Text>
                </Group>
            </Card.Section>
        </Card>
    );
};
