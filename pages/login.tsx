import { Login, Register } from "@components/auth";
import { Center, Stack, Tabs, Title } from "@mantine/core";
import { useState } from "react";
import Div100vh from "react-div-100vh";

const Authenticate = () => {
    return (
        <Div100vh>
            <Center style={{ height: "100%" }}>
                <Stack>
                    <Title order={2}>Welcome to Build Map</Title>
                    <Tabs>
                        <Tabs.List>
                            <Tabs.Tab value="login">Login</Tabs.Tab>
                            <Tabs.Tab value="register">Register</Tabs.Tab>
                        </Tabs.List>

                        <Tabs.Panel value="login">
                            <Login />
                        </Tabs.Panel>
                        <Tabs.Panel value="register">
                            <Register />
                        </Tabs.Panel>
                    </Tabs>
                </Stack>
            </Center>
        </Div100vh>
    );
};

export default Authenticate;
