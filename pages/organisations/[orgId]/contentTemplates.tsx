import { ContentTemplate } from "@components/contentTemplate";
import { ContentTemplateCard } from "@components/contentTemplate/contentTemplate-card";
import { ContentTemplateCreate } from "@components/contentTemplate/contentTemplate-create/contentTemplateCreate";
import { NavigationList } from "@components/navigation/linkList";
import { PageHeader } from "@components/ui/page-header";
import { useGetOrganisationContentTemplates } from "@data/contentTemplate/hooks";
import { faFile, faHouse, faUser } from "@fortawesome/pro-regular-svg-icons";
import { ContentTemplate as ContentTemplateProps } from "@lib/contentTemplate/data/contentTemplate.model";
import { Grid, Group, SegmentedControl } from "@mantine/core";
import { params as cloudParams } from "@serverless/cloud";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getCookie } from "cookies-next";
import { LayoutShellSideNav } from "layouts";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ReactElement, useState } from "react";
import { CleanedCamel } from "type-helpers";

interface ContentTemplatePageProps {
    organisationId: string;
    initialData: { contentTemplates: CleanedCamel<ContentTemplateProps>[] };
}

const HomeSidebar = () => {
    return (
        <NavigationList
            items={[
                {
                    link: "/home",
                    icon: faHouse,
                    text: "Home",
                },
                {
                    link: "/forms",
                    icon: faFile,
                    text: "Content Templates",
                    active: true,
                },
                {
                    link: "/users",
                    icon: faUser,
                    text: "Users",
                },
            ]}
        />
    );
};

function ContentTemplatePage({ organisationId, initialData }: ContentTemplatePageProps) {
    const { data } = useGetOrganisationContentTemplates(organisationId, initialData);
    // display either collection or components
    const [type, setType] = useState<ContentTemplateProps["type"]>("collection");
    const [activeTemplate, setActiveTemplate] = useState<CleanedCamel<ContentTemplateProps>>();
    return (
        <>
            <Head>
                <title>Organisation Content Templates</title>
                <meta name="description" content="Generated by create next app" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Group direction="column" grow spacing={0} sx={{ height: "100%" }} noWrap>
                <PageHeader title="Content Templates"></PageHeader>

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
                        <Group
                            position="apart"
                            px="md"
                            py="sm"
                            sx={(theme) => ({
                                borderBottom: `1px solid ${theme.colors.dark[6]}`,
                                background: theme.colors.dark[7],
                            })}
                        >
                            <SegmentedControl
                                data={[
                                    {
                                        value: "collection",
                                        label: "Templates",
                                    },
                                    {
                                        value: "component",
                                        label: "Components",
                                    },
                                ]}
                                value={type}
                                onChange={(value: ContentTemplateProps["type"]) => setType(value)}
                            />
                            <ContentTemplateCreate
                                type={type}
                                onCreate={setActiveTemplate}
                                organisationId={organisationId}
                            />
                        </Group>
                        <Group px="md" py="sm" direction="column" grow spacing="sm">
                            {data?.contentTemplates?.length
                                ? data.contentTemplates
                                      .filter((template) => template.type === type)
                                      .map((contentTemplate, i) => (
                                          <a
                                              key={contentTemplate.id}
                                              onClick={() => setActiveTemplate(contentTemplate)}
                                          >
                                              <ContentTemplateCard
                                                  contentTemplate={contentTemplate}
                                                  active={contentTemplate.id === activeTemplate?.id}
                                              />
                                          </a>
                                      ))
                                : "No content templates Found"}
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={9} px="md" py="sm">
                        {activeTemplate ? (
                            <ContentTemplate contentTemplate={activeTemplate} />
                        ) : (
                            <ContentTemplate.NullState />
                        )}
                    </Grid.Col>
                </Grid>
            </Group>
        </>
    );
}

ContentTemplatePage.getLayout = (page: ReactElement) => (
    <LayoutShellSideNav sidebarContent={<HomeSidebar />} headerProps={{ title: "Content Templates" }}>
        {page}
    </LayoutShellSideNav>
);

export async function getServerSideProps({ params, req }: GetServerSidePropsContext<{ orgId: string }>) {
    const { orgId } = params!;
    const token = getCookie("token", { req });
    const { data } = await axios.get(`${cloudParams.CLOUD_URL}/organisations/${orgId}/contentTemplates`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return {
        props: {
            organisationId: params!.orgId,
            initialData: camelcaseKeys(data),
        },
    };
}

export default ContentTemplatePage;
