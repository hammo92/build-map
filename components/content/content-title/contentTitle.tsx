import { useGetContent } from '@data/content/hooks'
import { Content } from '@lib/content/data/content.model'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Skeleton, Text, Title, TitleProps } from '@mantine/core'
import dayjs from 'dayjs'
import React from 'react'
import { CleanedCamel } from 'type-helpers'
import { Required } from 'utility-types'

export const ContentTitle = ({
    contentId,
    initialData,
    titleProps,
    valueOnly,
}: {
    contentId: string
    initialData?: {
        content: CleanedCamel<Content>
        contentTemplate: CleanedCamel<ContentTemplate>
    }

    titleProps?: TitleProps
    valueOnly?: boolean
}) => {
    const { data } = useGetContent(contentId, initialData ?? undefined)

    if (data?.content && data?.contentTemplate) {
        return (
            <Text lineClamp={1}>
                <Title order={1} {...titleProps}>
                    {data.content.title}
                </Title>
            </Text>
        )
    }

    return (
        <Skeleton>
            {!valueOnly && <Title {...titleProps}>Placeholder</Title>}
        </Skeleton>
    )
}
