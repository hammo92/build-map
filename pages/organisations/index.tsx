import { CreateOrganisation, JoinOrganisation } from "@components/organisation";
import { OrganisationList } from "@components/organisation/organisation-list";
import { Box, Button, Group, Modal, Tabs, Title } from "@mantine/core";
import { LayoutShellSideNav } from "layouts";
import Head from "next/head";
import React, { ReactElement, useState } from "react";

const Organisations = () => {
    const [open, setOpen] = useState(false);
    const [activeTab, setActiveTab] = useState(0);
    return (
        <>
            <Head>
                <title>Dashboard</title>
                <meta
                    name="description"
                    content="Generated by create next app"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Group
                grow
                sx={(theme) => ({
                    padding: theme.spacing.md,
                })}
                direction="column"
            >
                <Group direction="column" grow>
                    <Group direction="row" position="apart">
                        <Title order={1} sx={{ fontSize: 64 }}>
                            Organisations
                        </Title>
                        <Button onClick={() => setOpen(true)}>
                            Add Organisation
                        </Button>
                    </Group>
                </Group>
                <Box>
                    <OrganisationList />
                </Box>
            </Group>
            <Modal
                onClose={() => setOpen(false)}
                opened={open}
                title="Add Organisation"
            >
                <Tabs grow active={activeTab} onTabChange={setActiveTab}>
                    <Tabs.Tab label="Create New">
                        <CreateOrganisation />
                    </Tabs.Tab>
                    <Tabs.Tab label="Join">
                        <JoinOrganisation />
                    </Tabs.Tab>
                </Tabs>
            </Modal>
        </>
    );
};

Organisations.getLayout = function getLayout(page: ReactElement) {
    return <LayoutShellSideNav>{page}</LayoutShellSideNav>;
};

export default Organisations;
