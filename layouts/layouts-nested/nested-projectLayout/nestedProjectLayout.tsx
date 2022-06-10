import { SidebarProjects } from "@components/navigation/sidebar/sidebar-projects";
import { LayoutShellSideNav } from "layouts/shell";
import { FC } from "react";

export const NestedProjectLayout: FC = ({ children }) => (
    <LayoutShellSideNav
        sidebarContent={<SidebarProjects />}
        headerProps={{ title: "Project Dashboard" }}
    >
        {children}
    </LayoutShellSideNav>
);
