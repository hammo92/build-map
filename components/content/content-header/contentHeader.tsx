import { useDeleteContent } from '@data/content/hooks'
import { faTrash } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Content } from '@lib/content/data/content.model'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { ActionIcon, Button, Group, Title } from '@mantine/core'
import React, { FC } from 'react'
import { useFormContext } from 'react-hook-form'
import { CleanedCamel } from 'type-helpers'
import { ContentStatus } from '../content-status'
import { ContentTitle } from '../content-title'

export const ContentHeader: FC<{
    content: CleanedCamel<Content>
    contentTemplate: CleanedCamel<ContentTemplate>
    loading?: boolean
}> = ({ content, contentTemplate, loading }) => {
    const { formState } = useFormContext()
    const { mutateAsync, isLoading } = useDeleteContent()
    return (
        <Group
            position="apart"
            noWrap
            px="md"
            pt="sm"
            /*sx={(theme) => ({
                borderBottom: `1px solid ${theme.colors.dark[6]}`,
            })}*/
        >
            <Group noWrap>
                {/*<ContentTitle*/}
                {/*    contentId={content.id}*/}
                {/*    initialData={{*/}
                {/*        content,*/}
                {/*        contentTemplate,*/}
                {/*    }}*/}
                {/*/>*/}
                <Title order={1}>{content.title}</Title>
            </Group>

            <Group noWrap sx={{ flexShrink: 0 }}>
                <ContentStatus content={content} />

                {content.status !== 'archived' && (
                    <Button
                        type="submit"
                        disabled={loading || !formState.isDirty}
                        loading={loading}
                    >
                        Save
                    </Button>
                )}
                {content.status === 'draft' && (
                    <ActionIcon
                        color="red"
                        variant="filled"
                        size="lg"
                        onClick={() => mutateAsync(content.id)}
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                )}
            </Group>
        </Group>
    )
}
