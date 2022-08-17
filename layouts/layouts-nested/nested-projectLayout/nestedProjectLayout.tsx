import { SidebarProjects } from "@components/navigation/sidebar/sidebar-projects";
import { LayoutShellSideNav } from "layouts/shell";
import React, { FC, ReactNode } from "react";

export const NestedProjectLayout = ({ children }: { children: ReactNode }) => (
    <LayoutShellSideNav
        sidebarContent={<SidebarProjects />}
        headerProps={{ title: "Project Dashboard" }}
    >
        {children}
    </LayoutShellSideNav>
);
