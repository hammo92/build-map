import { FormTemplate } from "@components/formTemplate";
import { FormTemplateCard } from "@components/formTemplate/formTemplate-card";
import { FormTemplateCreateModal } from "@components/formTemplate/formTemplate-create/formTemplate-create-modal";
import { NavigationList } from "@components/navigation/link-list";
import { PageHeader } from "@components/ui/page-header";
import { useGetOrganisationFormTemplates } from "@data/formTemplate/hooks";
import { faFile, faHouse, faUser } from "@fortawesome/pro-regular-svg-icons";
import { Box, Button, Grid, Group, Paper, Title } from "@mantine/core";
import { LayoutShellSideNav } from "layouts";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { ReactElement, useState } from "react";

interface FormTemplatePageProps {
    organisationId: string;
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
                    text: "Form Templates",
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

function FormTemplatePage({ organisationId }: FormTemplatePageProps) {
    const { data } = useGetOrganisationFormTemplates(organisationId);
    const [modalOpen, setModalOpen] = useState(false);
    //console.log("data", data);
    return (
        <>
            <Head>
                <title>Organisation Form Templates</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Group
                direction="column"
                grow
                spacing={0}
                sx={{ height: "100%" }}
                noWrap
            >
                <PageHeader title="Form Templates">
                    <Button onClick={() => setModalOpen(true)}>
                        Add Template
                    </Button>
                </PageHeader>
                <Grid
                    sx={(theme) => ({
                        borderTop: `1px solid ${theme.colors.dark[6]}`,
                    })}
                    gutter="md"
                    px="sm"
                    mx={0}
                >
                    <Grid.Col
                        span={3}
                        sx={(theme) => ({
                            borderRight: `1px solid ${theme.colors.dark[6]}`,
                        })}
                    >
                        <Group direction="column" grow>
                            {data?.formTemplates?.length
                                ? data.formTemplates.map((formTemplate, i) => (
                                      <FormTemplateCard
                                          key={formTemplate.id}
                                          formTemplate={formTemplate}
                                      />
                                  ))
                                : "No templates Found"}
                        </Group>
                    </Grid.Col>
                    <Grid.Col span={9}>
                        <FormTemplate />
                    </Grid.Col>
                </Grid>
            </Group>
            <FormTemplateCreateModal
                opened={modalOpen}
                onClose={() => setModalOpen(false)}
            />
            {/*<Group>
                        <OrganisationInviteCreate
                            organisationId={organisationId}
                        />
                    </Group> */}
        </>
    );
}

FormTemplatePage.getLayout = (page: ReactElement) => (
    <LayoutShellSideNav
        sidebarContent={<HomeSidebar />}
        headerProps={{ title: "Form Templates" }}
    >
        {page}
    </LayoutShellSideNav>
);

export async function getServerSideProps({
    params,
    req,
}: GetServerSidePropsContext<{ orgId: string }>) {
    return {
        props: {
            organisationId: params!.orgId,
        },
    };
}

export default FormTemplatePage;
