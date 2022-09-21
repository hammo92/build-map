import { Content } from "@components/content/content";
import { Content as ContentProps } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Stack } from "@mantine/core";
import { params as cloudParams } from "@serverless/cloud";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getCookie } from "cookies-next";
import { NestedProjectLayout } from "layouts/layouts-nested/nested-projectLayout";
import { GetServerSidePropsContext } from "next";
import { ReactElement } from "react";
import { CleanedCamel, CleanedSnake } from "type-helpers";

interface ContentEntryProps {
    content: CleanedCamel<ContentProps>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}

const ContentEntry = ({ content, contentTemplate }: ContentEntryProps) => {
    return (
        <Stack>
            <Content content={content} contentTemplate={contentTemplate} />
        </Stack>
    );
};

ContentEntry.getLayout = (page: ReactElement) => <NestedProjectLayout>{page}</NestedProjectLayout>;

export async function getServerSideProps({
    params,
    req,
}: GetServerSidePropsContext<{
    contentId: string;
    projectId: string;
}>) {
    const { contentId, projectId } = params!;
    const token = getCookie("token", { req });
    const {
        data: { contentTemplate, content },
    } = await axios.get<{
        content: CleanedSnake<ContentProps>;
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`${cloudParams.CLOUD_URL}/content/${contentId}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    return {
        props: {
            contentTemplate: camelcaseKeys(contentTemplate),
            content: camelcaseKeys(content),
            projectId,
        },
    };
}

export default ContentEntry;
