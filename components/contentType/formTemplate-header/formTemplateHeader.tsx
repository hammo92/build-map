import { Group } from "@mantine/core";
import React from "react";
import { ContentTypeDelete } from "../contentType-delete";
import { ContentTypeStatus } from "../contentType-status";
import { ContentTypeTitle } from "../contentType-title";

export const ContentTypeHeader = () => {
    return (
        <Group position="apart" noWrap>
            <ContentTypeTitle editable />
            <Group noWrap sx={{ flexShrink: 0 }}>
                <ContentTypeStatus />
                <ContentTypeDelete />
            </Group>
        </Group>
    );
};
