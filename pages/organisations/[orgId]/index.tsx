import { NavigationList } from "@components/navigation/linkList";
import { ProjectCreateButton } from "@components/project/project-create";
import { ProjectList } from "@components/project/project-list";
import { useGetMe } from "@data/user/hooks";
import { faFile, faHouse, faUser } from "@fortawesome/pro-regular-svg-icons";
import { Divider, Group, Title } from "@mantine/core";
import dayjs from "dayjs";
import { LayoutShellSideNav } from "layouts";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import React, { ReactElement } from "react";
import { capitalise } from "utils/stringTransform";

interface OrganisationPageProps {
    organisationId: string;
}

const OrgSidebar = () => {
    return (
        <NavigationList
            items={[
                {
                    link: "/home",
                    icon: faHouse,
                    text: "Home",
                    active: true,
                },
                {
                    link: "contentTypes",
                    icon: faFile,
                    text: "Content Types",
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

const WelcomeBanner = () => {
    const { data, isLoading, error } = useGetMe();
    const hour = parseInt(dayjs().format("H"));
    const timeOfDay =
        hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    return (
        <>{`Good ${timeOfDay}${
            data?.user ? `, ${capitalise(data.user.nickname)}` : ""
        }`}</>
    );
};

function OrganisationPage({ organisationId }: OrganisationPageProps) {
    return (
        <>
            <Head>
                <title>Organisation Home</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Group direction="column" grow p="md">
                <Group direction="column" spacing={0}>
                    <Title order={3}>{dayjs().format("dddd MMM D")}</Title>
                    <Title>
                        <WelcomeBanner />
                    </Title>
                </Group>
                <Group
                    direction="column"
                    grow
                    p="md"
                    sx={(theme) => ({
                        background: theme.colors.dark[6],
                        borderRadius: theme.radius.md,
                    })}
                >
                    <Group position="apart">
                        <Title>Projects</Title>
                        <ProjectCreateButton organisationId={organisationId} />
                    </Group>
                    <Divider />
                    <ProjectList />
                </Group>
            </Group>

            {/*<Group>
                        <OrganisationInviteCreate
                            organisationId={organisationId}
                        />
                    </Group> */}
        </>
    );
}

OrganisationPage.getLayout = (page: ReactElement) => (
    <LayoutShellSideNav
        sidebarContent={<OrgSidebar />}
        headerProps={{ title: "Dashboard" }}
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

export default OrganisationPage;
