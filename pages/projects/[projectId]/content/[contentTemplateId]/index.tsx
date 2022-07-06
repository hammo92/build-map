import { Content } from "@components/content/content";
import { ContentCard } from "@components/content/content-card/contentCard";
import { ContentCreate } from "@components/content/content-create";
import { PageHeader } from "@components/ui/page-header";
import { useGetProjectContentOfType } from "@data/content/hooks";
import { Content as ContentProps } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Grid, Group, SegmentedControl, Text } from "@mantine/core";
import { params as cloudParams } from "@serverless/cloud";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getCookie } from "cookies-next";
import { NestedProjectLayout } from "layouts/layouts-nested/nested-projectLayout";
import { GetServerSidePropsContext } from "next";
import pluralize from "pluralize";
import { ReactElement, useState } from "react";
import { CleanedCamel, CleanedSnake } from "type-helpers";

interface ContentPageProps {
    content: CleanedCamel<ContentProps>[];
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
}

function ContentPage({ contentTemplate, projectId, content }: ContentPageProps) {
    const [activeContent, setActiveContent] = useState<CleanedCamel<ContentProps>>();
    const { data } = useGetProjectContentOfType({
        projectId,
        contentTemplateId: contentTemplate.id,
        initialData: {
            content,
        },
    });
    return (
        <>
            <Group direction="column" grow spacing={0} sx={{ height: "100%" }} noWrap>
                <PageHeader title={pluralize(contentTemplate.name)}>
                    <Text>View:</Text>
                    <SegmentedControl
                        data={[
                            { label: "List", value: "list" },
                            { label: "Cards", value: "cards" },
                            { label: "Board", value: "board" },
                        ]}
                    />
                    <ContentCreate contentTemplate={contentTemplate} projectId={projectId} />
                </PageHeader>
                <Grid
                    sx={(theme) => ({
                        borderTop: `1px solid ${theme.colors.dark[6]}`,
                    })}
                    gutter="md"
                    mx={0}
                >
                    <Grid.Col
                        span={3}
                        sx={(theme) => ({
                            borderRight: `1px solid ${theme.colors.dark[6]}`,
                        })}
                        p={0}
                    >
                        <Group px="md" py="sm" direction="column" grow spacing="sm">
                            {data?.content?.length
                                ? data.content.map((content, i) => (
                                      <a
                                          key={content.id}
                                          onClick={() => setActiveContent(content)}
                                          style={{ width: "100%" }}
                                      >
                                          <ContentCard
                                              content={content}
                                              active={content.id === activeContent?.id}
                                          />
                                      </a>
                                  ))
                                : "No content entries found"}
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={9} px="md" py="sm">
                        <Content />
                    </Grid.Col>
                </Grid>
            </Group>
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
