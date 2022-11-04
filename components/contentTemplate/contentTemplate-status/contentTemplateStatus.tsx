import { useUpdateContentTemplate } from '@data/contentTemplate/hooks'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Button } from '@mantine/core'
import React from 'react'
import { CleanedCamel } from 'type-helpers'

export const ContentTemplateStatus = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>
}) => {
    const { mutateAsync } = useUpdateContentTemplate()
    const onChange = async (value: 'archived' | 'published') => {
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            status: value,
        })
    }

    // check if content template has enough fields to be published
    const contentTemplateIsValid =
        (contentTemplate.properties.length > 0 &&
            contentTemplate.properties[0].type !== 'title') ||
        contentTemplate.properties.length > 1

    if (
        contentTemplate.status === 'draft' ||
        contentTemplate.status === 'archived'
    ) {
        return (
            <Button
                type="submit"
                disabled={!contentTemplateIsValid}
                onClick={() => onChange('published')}
            >
                Publish
            </Button>
        )
    }
    if (contentTemplate.status === 'published') {
        return (
            <Button
                type="submit"
                onClick={() => onChange('archived')}
                color={'pink'}
            >
                Archive
            </Button>
        )
    }
    return null
}
