import { Content } from '@components/content/content'
import { Content as ContentProps } from '@lib/content/data/content.model'
import { ContentTemplate } from '@lib/contentTemplate/data/contentTemplate.model'
import { Group, Stack } from '@mantine/core'
import { params as cloudParams } from '@serverless/cloud'
import axios from 'axios'
import camelcaseKeys from 'camelcase-keys'
import { getCookie } from 'cookies-next'
import { NestedProjectLayout } from 'layouts/layouts-nested/nested-projectLayout'
import { GetServerSidePropsContext } from 'next'
import { ReactElement } from 'react'
import { CleanedCamel, CleanedSnake } from 'type-helpers'
import auth0 from 'utils/auth0'

interface ContentEntryProps {
    content: CleanedCamel<ContentProps>
    contentTemplate: CleanedCamel<ContentTemplate>
}

const ContentEntry = ({ content, contentTemplate }: ContentEntryProps) => {
    return (
        <Stack>
            <Content content={content} contentTemplate={contentTemplate} />
        </Stack>
    )
}

ContentEntry.getLayout = (page: ReactElement) => (
    <NestedProjectLayout>{page}</NestedProjectLayout>
)

export async function getServerSideProps({
    params,
    req,
    res,
}: GetServerSidePropsContext<{
    contentId: string
    projectId: string
}>) {
    const { contentId, projectId } = params!
    const session = auth0.getSession(req, res)
    const headers = {
        ...req.cookies,
        ...(session && { Authorization: `Bearer ${session.idToken}` }),
    }
    const {
        data: { contentTemplate, content },
    } = await axios.get<{
        content: CleanedSnake<ContentProps>
        contentTemplate: CleanedSnake<ContentTemplate>
    }>(`${cloudParams.CLOUD_URL}/content/${contentId}`, {
        headers,
    })

    return {
        props: {
            contentTemplate: camelcaseKeys(contentTemplate),
            content: camelcaseKeys(content),
            projectId,
        },
    }
}

export default ContentEntry
