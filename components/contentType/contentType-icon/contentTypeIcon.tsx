import { IconPicker } from "@components/ui/iconPicker";
import { Keys } from "@data/contentType/constants";
import { ContentTypeResponse } from "@data/contentType/queries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTypeIcon as ContentTypeIconProps } from "@lib/contentType/data/contentType.model";
import { ThemeIcon } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React, { useState } from "react";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { IconEdit } from "./icon-edit/iconEdit";

export const ContentTypeIcon = () => {
    const { contentTypeId, hasEditPermission } = useSnapshot(contentTypeState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTypeResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTypeId,
    ]);

    if (data?.contentType?.icon && hasEditPermission)
        return <IconEdit defaultValue={data.contentType.icon} />;
    else if (data?.contentType?.icon)
        return (
            <ThemeIcon color={data?.contentType?.icon.color}>
                <FontAwesomeIcon icon={data?.contentType.icon.icon} />
            </ThemeIcon>
        );
    return null;
};
