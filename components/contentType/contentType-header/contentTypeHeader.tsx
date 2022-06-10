import { Group } from "@mantine/core";
import React from "react";
import { ContentTypeDelete } from "../contentType-delete";
import { ContentTypeIcon } from "../contentType-icon";
import { ContentTypeStatus } from "../contentType-status";
import { ContentTypeTitle } from "../contentType-title";

export const ContentTypeHeader = () => {
    return (
        <Group position="apart" noWrap>
            <Group noWrap>
                <ContentTypeIcon />
                <ContentTypeTitle editable />
            </Group>

            <Group noWrap sx={{ flexShrink: 0 }}>
                <ContentTypeStatus />
                <ContentTypeDelete />
            </Group>
        </Group>
    );
};
