import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentType } from "@lib/contentType/data/contentType.model";
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
import { contentTypeState } from "@state/contentType";
import React, { FC, useState } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { useStyles } from "./styles";

interface ContentTypeCardProps {
    contentType: CleanedCamel<ContentType>;
}

export const ContentTypeCard: FC<ContentTypeCardProps> = ({ contentType }) => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const { classes } = useStyles();
    return (
        <Card
            className={`${classes.clickableCard} ${
                contentTypeId === contentType.id && classes.active
            }`}
            onClick={() => (contentTypeState.contentTypeId = contentType.id)}
        >
            <Card.Section
                p="md"
                sx={(theme) => ({ background: theme.colors.dark[7] })}
            >
                <Group position="apart" noWrap>
                    <Group noWrap>
                        <ThemeIcon color={contentType.icon.color}>
                            <FontAwesomeIcon icon={contentType.icon.icon} />
                        </ThemeIcon>
                        <Text size="lg" lineClamp={1}>
                            {contentType.name}
                        </Text>
                    </Group>
                    <Badge
                        sx={{ flexShrink: 0 }}
                        color={
                            contentType.status === "published"
                                ? "violet"
                                : "blue"
                        }
                        variant={
                            contentType.status === "published"
                                ? "filled"
                                : "outline"
                        }
                    >
                        {contentType.status}
                    </Badge>
                </Group>
            </Card.Section>
            <Card.Section p="md">
                <Group direction="column" grow spacing="xs">
                    <Text>{`${contentType.fields.length} fields`}</Text>
                </Group>
            </Card.Section>
        </Card>
    );
};
