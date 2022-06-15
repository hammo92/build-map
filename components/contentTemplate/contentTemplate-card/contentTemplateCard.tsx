import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import {
    Badge,
    Card,
    Grid,
    Group,
    Paper,
    Text,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React, { FC, useState } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { useStyles } from "./styles";

interface ContentTemplateCardProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
}

export const ContentTemplateCard: FC<ContentTemplateCardProps> = ({
    contentTemplate,
}) => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const { classes } = useStyles();
    return (
        <Card
            className={`${classes.clickableCard} ${
                contentTemplateId === contentTemplate.id && classes.active
            }`}
            onClick={() =>
                (contentTemplateState.contentTemplateId = contentTemplate.id)
            }
        >
            <Card.Section
                p="md"
                sx={(theme) => ({ background: theme.colors.dark[7] })}
            >
                <Group position="apart" noWrap>
                    <Group noWrap>
                        <ThemeIcon color={contentTemplate.icon.color}>
                            <FontAwesomeIcon icon={contentTemplate.icon.icon} />
                        </ThemeIcon>
                        <Text size="lg" lineClamp={1}>
                            {contentTemplate.name}
                        </Text>
                    </Group>
                    <Badge
                        sx={{ flexShrink: 0 }}
                        color={
                            contentTemplate.status === "published"
                                ? "violet"
                                : "blue"
                        }
                        variant={
                            contentTemplate.status === "published"
                                ? "filled"
                                : "outline"
                        }
                    >
                        {contentTemplate.status}
                    </Badge>
                </Group>
            </Card.Section>
            <Card.Section p="md">
                <Group direction="column" grow spacing="xs">
                    <Text>{`${contentTemplate.fields.length} fields`}</Text>
                </Group>
            </Card.Section>
        </Card>
    );
};
