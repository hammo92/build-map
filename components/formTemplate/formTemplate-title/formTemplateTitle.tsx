import { Keys } from "@data/formTemplate/constants";
import { FormTemplateResponse } from "@data/formTemplate/queries";
import { FormTemplate } from "@lib/formTemplate/data/formTemplate.model";
import { Group, Skeleton, Text, Title } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React, { FC } from "react";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { TitleEdit } from "./title-edit";

export const FormTemplateTitle: FC<{ editable?: boolean }> = ({ editable }) => {
    const queryClient = useQueryClient();
    const { formTemplateId, hasEditPermission } =
        useSnapshot(formTemplateState);
    const data = queryClient.getQueryData<FormTemplateResponse>([
        Keys.GET_FORM_TEMPLATE,
        formTemplateId,
    ]);
    return (
        <Group noWrap>
            {data?.formTemplate?.name ? (
                <>
                    <Text lineClamp={1}>
                        <Title order={1}>{data.formTemplate.name}</Title>{" "}
                    </Text>
                    {
                        //if user has edit permissions and edit prop is true
                        editable && hasEditPermission && <TitleEdit />
                    }
                </>
            ) : (
                <Skeleton height={44} width={300} />
            )}
        </Group>
    );
};
