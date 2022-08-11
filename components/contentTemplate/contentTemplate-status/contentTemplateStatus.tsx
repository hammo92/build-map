import { Keys } from "@data/contentTemplate/constants";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Select, Tooltip } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";

export const ContentTemplateStatus = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const { mutateAsync } = useUpdateContentTemplate();
    const onChange = async (value: "draft" | "published") => {
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            status: value,
        });
    };
    return (
        <Select
            value={contentTemplate.status}
            data={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
            ]}
            disabled={!contentTemplate.fields.length}
            onChange={onChange}
        />
    );
};
