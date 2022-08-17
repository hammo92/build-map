import { UserButton } from "@components/user";
import { useGetMe } from "@data/user/hooks";
import { Button, Group, Navbar, Skeleton, Title } from "@mantine/core";
import React, { FC, ReactNode } from "react";
import { useStyles } from "./styles";

export const SideBar: FC<{ children: ReactNode }> = ({ children }) => {
    const { data, error, isLoading } = useGetMe();
    const { classes } = useStyles();
    return (
        <Navbar width={{ base: 300 }} className={classes.navbar}>
            <Navbar.Section className={classes.header}>
                <Group align="center" className={classes.logo}>
                    <Title order={3}>BuildMap</Title>
                </Group>
            </Navbar.Section>
            {/* <BackButton /> */}
            <Navbar.Section style={{ flex: 1 }} className={classes.content}>
                {children}
            </Navbar.Section>
            {isLoading ? (
                <Skeleton height={100} />
            ) : (
                data?.user && (
                    <Navbar.Section className={classes.footer}>
                        <UserButton user={data.user} />
                        <Button fullWidth variant="light" color="pink" radius={0} compact>
                            {!data.user ? "Login" : "Logout"}
                        </Button>
                    </Navbar.Section>
                )
            )}
        </Navbar>
    );
};
