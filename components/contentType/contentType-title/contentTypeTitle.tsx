import { Keys } from "@data/contentType/constants";
import { ContentTypeResponse } from "@data/contentType/queries";
import { ContentType } from "@lib/contentType/data/contentType.model";
import { Group, Skeleton, Text, Title } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React, { FC } from "react";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { TitleEdit } from "./title-edit";

export const ContentTypeTitle: FC<{ editable?: boolean }> = ({ editable }) => {
    const queryClient = useQueryClient();
    const { contentTypeId, hasEditPermission } = useSnapshot(contentTypeState);
    const data = queryClient.getQueryData<ContentTypeResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTypeId,
    ]);
    return (
        <Group noWrap>
            {data?.contentType?.name ? (
                <>
                    <Text lineClamp={1}>
                        <Title order={1}>{data.contentType.name}</Title>{" "}
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
