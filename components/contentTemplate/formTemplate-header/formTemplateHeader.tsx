import { Group } from "@mantine/core";
import React from "react";
import { ContentTemplateDelete } from "../contentTemplate-delete";
import { ContentTemplateStatus } from "../contentTemplate-status";
import { ContentTemplateTitle } from "../contentTemplate-title";

export const ContentTemplateHeader = () => {
    return (
        <Group position="apart" noWrap>
            <ContentTemplateTitle editable />
            <Group noWrap sx={{ flexShrink: 0 }}>
                <ContentTemplateStatus />
                <ContentTemplateDelete />
            </Group>
        </Group>
    );
};
