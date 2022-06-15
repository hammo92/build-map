import { Keys } from "@data/contentTemplate/constants";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { Select, Tooltip } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";

export const ContentTemplateStatus = () => {
    const { contentTemplateId, hasEditPermission } =
        useSnapshot(contentTemplateState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTemplateResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTemplateId,
    ]);
    const { mutateAsync } = useUpdateContentTemplate();
    const onChange = async (value: "draft" | "published") => {
        await mutateAsync({
            contentTemplateId: contentTemplateId,
            status: value,
        });
    };
    return (
        <Select
            value={data?.contentTemplate.status}
            data={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
            ]}
            disabled={
                !hasEditPermission || !data?.contentTemplate.fields.length
            }
            onChange={onChange}
        />
    );
};
