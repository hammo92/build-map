import { SideBar } from "@components/navigation";
import { HeaderProps } from "@components/navigation/header";
import { Box, Group } from "@mantine/core";
import { FC, ReactElement, ReactNode } from "react";
import Div100vh from "react-div-100vh";

interface LayoutShellSideNavProps {
    sidebarContent?: ReactElement;
    headerProps?: HeaderProps;
    children: ReactNode;
}

export const LayoutShellSideNav: FC<LayoutShellSideNavProps> = ({
    children,
    sidebarContent,
    headerProps,
}) => {
    return (
        <Div100vh>
            <Group
                sx={(theme) => ({
                    backgroundColor:
                        theme.colorScheme === "dark" ? theme.colors.dark[8] : theme.colors.gray[0],
                    height: "100%",
                })}
                spacing={0}
                align="flex-start"
            >
                <SideBar>{sidebarContent}</SideBar>
                <Box sx={{ flex: "1", height: "100%" }}>
                    {/* <Header {...headerProps} /> */}
                    {children}
                </Box>
            </Group>
        </Div100vh>
    );
};
