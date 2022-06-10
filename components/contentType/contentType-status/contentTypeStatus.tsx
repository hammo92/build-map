import { Keys } from "@data/contentType/constants";
import { useUpdateContentType } from "@data/contentType/hooks";
import { ContentTypeResponse } from "@data/contentType/queries";
import { Select, Tooltip } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";

export const ContentTypeStatus = () => {
    const { contentTypeId, hasEditPermission } = useSnapshot(contentTypeState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTypeResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTypeId,
    ]);
    const { mutateAsync } = useUpdateContentType();
    const onChange = async (value: "draft" | "published") => {
        await mutateAsync({
            contentTypeId: contentTypeId,
            status: value,
        });
    };
    return (
        <Select
            value={data?.contentType.status}
            data={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
            ]}
            disabled={!hasEditPermission || !data?.contentType.fields.length}
            onChange={onChange}
        />
    );
};
