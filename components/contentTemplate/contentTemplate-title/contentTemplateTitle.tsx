import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Skeleton, Text, Title } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React, { FC } from "react";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { TitleEdit } from "./title-edit";

export const ContentTemplateTitle: FC<{ editable?: boolean }> = ({
    editable,
}) => {
    const queryClient = useQueryClient();
    const { contentTemplateId, hasEditPermission } =
        useSnapshot(contentTemplateState);
    const data = queryClient.getQueryData<ContentTemplateResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTemplateId,
    ]);
    return (
        <Group noWrap>
            {data?.contentTemplate?.name ? (
                <>
                    <Text lineClamp={1}>
                        <Title order={1}>{data.contentTemplate.name}</Title>{" "}
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
