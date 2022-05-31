import { Login, Register } from "@components/auth";
import Div100vh from "react-div-100vh";
import { Center, Group, Tabs, Title } from "@mantine/core";
import React, { useState } from "react";
const Authenticate = () => {
    const [activeTab, setActiveTab] = useState(0);
    return (
        <Div100vh>
            <Center style={{ height: "100%" }}>
                <Group direction="column">
                    <Title order={2}>Welcome to Build Map</Title>
                    <Tabs active={activeTab} onTabChange={setActiveTab}>
                        <Tabs.Tab label="Login">
                            <Login />
                        </Tabs.Tab>
                        <Tabs.Tab label="Register">
                            <Register />
                        </Tabs.Tab>
                    </Tabs>
                </Group>
            </Center>
        </Div100vh>
    );
};

export default Authenticate;
