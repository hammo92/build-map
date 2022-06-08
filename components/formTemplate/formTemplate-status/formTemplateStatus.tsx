import { Keys } from "@data/formTemplate/constants";
import { useUpdateFormTemplate } from "@data/formTemplate/hooks";
import { FormTemplateResponse } from "@data/formTemplate/queries";
import { Select, Tooltip } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React from "react";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";

export const FormTemplateStatus = () => {
    const { formTemplateId, hasEditPermission } =
        useSnapshot(formTemplateState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<FormTemplateResponse>([
        Keys.GET_FORM_TEMPLATE,
        formTemplateId,
    ]);
    const { mutateAsync } = useUpdateFormTemplate();
    const onChange = async (value: "draft" | "published") => {
        await mutateAsync({
            formTemplateId: formTemplateId,
            status: value,
        });
    };
    return (
        <Select
            value={data?.formTemplate.status}
            data={[
                { value: "draft", label: "Draft" },
                { value: "published", label: "Published" },
            ]}
            disabled={!hasEditPermission || !data?.formTemplate.fields.length}
            onChange={onChange}
        />
    );
};
