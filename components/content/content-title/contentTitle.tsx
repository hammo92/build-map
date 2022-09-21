import { useGetContent } from "@data/content/hooks";
import { Content } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Skeleton, Text, Title, TitleProps } from "@mantine/core";
import dayjs from "dayjs";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";

export const getContentTitle = ({
    content,
    contentTemplate,
}: {
    content: CleanedCamel<Content>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    let title;
    const { value, type } = contentTemplate.title;
    if (type === "contentInfo") {
        // When type is "contentInfo" value is key of content eg. "id"
        title = content[value as keyof CleanedCamel<Content>] as string;
        if (dayjs(title).isValid()) {
            title = dayjs(title).format("D/MM/YY HH:mm:ss");
        }
    } else {
        // Type is "contentProperty" so value is contentTemplate field eg. "title"
        const field = content.fields.find(({ templateFieldId }) => templateFieldId === value);
        if (field?.type === "date" && field.value) {
            const date = dayjs(field.value);
            switch (field.variant) {
                case "date":
                    title = date.format("D/MM/YY");
                    break;
                case "dateTime":
                    title = date.format("D/MM/YY HH:mm:ss");
                    break;
                case "time":
                    title = date.format("HH:mm:ss");
            }
        } else {
            title = field?.value;
        }
    }
    return title;
};

export const ContentTitle = ({
    contentId,
    initialData,
    titleProps,
    valueOnly,
}: {
    contentId: string;
    initialData?: {
        content: CleanedCamel<Content>;
        contentTemplate: CleanedCamel<ContentTemplate>;
    };

    titleProps?: TitleProps;
    valueOnly?: boolean;
}) => {
    const { data } = useGetContent(contentId, initialData ?? undefined);

    if (data?.content && data?.contentTemplate) {
        const { content, contentTemplate } = data;
        const title = getContentTitle({ content, contentTemplate }) ?? contentTemplate.name;

        if (valueOnly) return <>{title}</>;
        return (
            <Text lineClamp={1}>
                <Title order={1} {...titleProps}>
                    {title}
                </Title>
            </Text>
        );
    }

    return <Skeleton>{!valueOnly && <Title {...titleProps}>Placeholder</Title>}</Skeleton>;
};
