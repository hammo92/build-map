import { Content } from "@components/content/content";
import { ContentCard } from "@components/content/content-card/contentCard";
import { ContentCreate } from "@components/content/content-create";
import { PageHeader } from "@components/ui/page-header";
import { useGetProjectContentOfType } from "@data/content/hooks";
import { Content as ContentProps } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Container, Grid, Group, SegmentedControl, Stack, Text } from "@mantine/core";
import { params as cloudParams } from "@serverless/cloud";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getCookie } from "cookies-next";
import { NestedProjectLayout } from "layouts/layouts-nested/nested-projectLayout";
import { GetServerSidePropsContext } from "next";
import Image from "next/image";
import pluralize from "pluralize";
import { ReactElement, useEffect, useMemo, useState } from "react";
import { CleanedCamel, CleanedSnake } from "type-helpers";
import { SortByDateIso } from "utils/date";

import Illustration from "../../../../../../../public/images/tokyo/3.0-03.svg";
interface ContentPageProps {
    content: CleanedCamel<ContentProps>[];
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
}

function ContentPage({ contentTemplate, projectId, content }: ContentPageProps) {
    const [activeContentId, setActiveContentId] = useState<string>();
    const { data } = useGetProjectContentOfType({
        projectId,
        contentTemplateId: contentTemplate.id,
        initialData: {
            content,
            contentTemplate,
        },
    });
    const getActiveContent = useMemo(() => {
        if (!data) {
            setActiveContentId("");
            return;
        }
        if (!activeContentId) return;
        const contentIndexedById = data.content.reduce<Record<string, CleanedCamel<ContentProps>>>(
            (acc, curr) => ({
                ...acc,
                [curr.id]: curr,
            }),
            {}
        );
        return contentIndexedById[activeContentId];
    }, [data, activeContentId]);
    return (
        <>
            <Stack spacing={0} sx={{ height: "100%" }}>
                <PageHeader title={pluralize(contentTemplate.name)}>
                    <Text>View:</Text>
                    <SegmentedControl
                        data={[
                            { label: "List", value: "list" },
                            { label: "Cards", value: "cards" },
                            { label: "Board", value: "board" },
                        ]}
                    />
                    <ContentCreate
                        contentTemplate={contentTemplate}
                        projectId={projectId}
                        onCreate={(newContent) => setActiveContentId(newContent.id)}
                    />
                </PageHeader>
                <Grid
                    sx={(theme) => ({
                        borderTop: `1px solid ${theme.colors.dark[6]}`,
                        flex: 1,
                        minHeight: 0,
                    })}
                    gutter="md"
                    m={0}
                >
                    <Grid.Col
                        span={3}
                        sx={(theme) => ({
                            borderRight: `1px solid ${theme.colors.dark[6]}`,
                            height: "100%",
                            overflow: "auto",
                        })}
                        p={0}
                    >
                        <Stack px="md" py="sm" spacing="sm">
                            {data?.content?.length
                                ? data.content
                                      .sort((a, b) =>
                                          SortByDateIso(a.lastEditedTime, b.lastEditedTime)
                                      )
                                      .map((content, i) => (
                                          <a
                                              key={content.id}
                                              onClick={() => setActiveContentId(content.id)}
                                              style={{ width: "100%" }}
                                          >
                                              <ContentCard
                                                  content={content}
                                                  contentTemplate={contentTemplate}
                                                  active={content.id === activeContentId}
                                              />
                                          </a>
                                      ))
                                : "No content entries found"}
                        </Stack>
                    </Grid.Col>
                    <Grid.Col span={9} sx={{ height: "100%", overflow: "auto" }} px="md">
                        {getActiveContent ? (
                            <Content content={getActiveContent} contentTemplate={contentTemplate} />
                        ) : (
                            <Container size="sm">
                                <Image src={Illustration} alt="select a form" />
                            </Container>
                        )}
                    </Grid.Col>
                </Grid>
            </Stack>
        </>
    );
}

ContentPage.getLayout = (page: ReactElement) => <NestedProjectLayout>{page}</NestedProjectLayout>;

export async function getServerSideProps({
    params,
    req,
}: GetServerSidePropsContext<{
    contentTemplateId: string;
    projectId: string;
}>) {
    const { contentTemplateId, projectId } = params!;
    const token = getCookie("token", { req });
    const {
        data: { contentTemplate, content },
    } = await axios.get<{
        content: CleanedSnake<ContentProps>[];
        contentTemplate: CleanedSnake<ContentTemplate>;
    }>(`${cloudParams.CLOUD_URL}/projects/${projectId}/contentTemplates/${contentTemplateId}`, {
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

export default ContentPage;
