import { useGetMe } from "@data/user/hooks";
import { Project } from "@lib/project/data/projectModel";
import { Divider, Group, Title } from "@mantine/core";
import { params as cloudParams } from "@serverless/cloud";
import { organisationState } from "@state/organisation";
import axios from "axios";
import camelcaseKeys from "camelcase-keys";
import { getCookie } from "cookies-next";
import dayjs from "dayjs";
import { NestedProjectLayout } from "layouts/layouts-nested/nested-projectLayout";
import { GetServerSidePropsContext } from "next";
import Head from "next/head";
import { ReactElement } from "react";
import { CleanedCamel } from "type-helpers";
import { capitalise } from "utils/stringTransform";

interface ProjectPageProps {
    projectId: string;
    projectDetails: CleanedCamel<Project>;
}

const WelcomeBanner = () => {
    const { data, isLoading, error } = useGetMe();
    const hour = parseInt(dayjs().format("H"));
    const timeOfDay = hour < 12 ? "morning" : hour < 18 ? "afternoon" : "evening";
    return <>{`Good ${timeOfDay}${data?.user ? `, ${capitalise(data.user.nickname)}` : ""}`}</>;
};

function ProjectPage({ projectId, projectDetails }: ProjectPageProps) {
    console.log("projectDetails :>> ", projectDetails);
    organisationState.activeOrganisation = projectDetails?.organisationId;
    return (
        <>
            <Head>
                <title>Organisation Home</title>
                <meta name="description" content="Generated by create next app" />
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
                    </Group>
                    <Divider />
                </Group>
            </Group>
        </>
    );
}

ProjectPage.getLayout = (page: ReactElement) => <NestedProjectLayout>{page}</NestedProjectLayout>;

export async function getServerSideProps({ params, req }: GetServerSidePropsContext<{ projectId: string }>) {
    const { projectId } = params!;
    const token = getCookie("token", { req });
    const { data } = await axios.get(`${cloudParams.CLOUD_URL}/projects/${projectId}`, {
        headers: {
            "Content-type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });
    return {
        props: {
            projectId: params!.projectId,
            projectDetails: camelcaseKeys(data.project),
        },
    };
}

export default ProjectPage;
