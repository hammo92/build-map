import { TreeData } from "@atlaskit/tree";
import {
    transformTemplateToTree,
    transformTreeGroupsToModel,
} from "@components/contentTemplate/utils/dataTransforms";
import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import { useDeletePropertyGroup, useReorderPropertyGroups } from "@data/contentTemplate/hooks";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { PropertyGroup } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button, Group, Stack, Text } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import { group } from "console";
import React from "react";
import { useQueryClient } from "react-query";
import { ulid } from "ulid";
import { objArrToKeyIndexedMap } from "utils/arrayModify";

interface GroupDeleteProps {
    contentTemplateId: string;
    groupId: string;
    component?: React.ReactElement;
    deleteContents?: boolean;
}
interface GroupDeleteFormProps {
    groupId: string | number;
    contentTemplateId: string;
}

const GroupDeleteConfirm = ({ groupId, contentTemplateId }: GroupDeleteFormProps) => {
    const { mutateAsync, isLoading } = useDeletePropertyGroup();
    const onConfirm = async () => {
        mutateAsync({
            contentTemplateId: contentTemplateId,
            deleteContents: true,
            groupId: `${groupId}`,
        });
        closeAllModals();
    };
    return (
        <Stack>
            <Text>
                This will delete the group including all nested groups and fields, are you sure you
                want to continue?
            </Text>
            <Group grow>
                <Button
                    onClick={() => closeAllModals()}
                    variant="light"
                    color="gray"
                    disabled={isLoading}
                >
                    Cancel
                </Button>
                <Button loading={isLoading} disabled={isLoading} color="red" onClick={onConfirm}>
                    Delete
                </Button>
            </Group>
        </Stack>
    );
};

export const GroupDelete = ({
    contentTemplateId,
    groupId,
    deleteContents,
    component,
}: GroupDeleteProps) => {
    const queryClient = useQueryClient();
    const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
    const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);
    const { mutateAsync, isLoading } = useDeletePropertyGroup();

    if (!currentData?.contentTemplate) return null;

    const { contentTemplate } = currentData;

    const children: (string | number)[] = [];
    const propertyMap = objArrToKeyIndexedMap(currentData.contentTemplate.propertyGroups, "id");

    const findChildren = (propertyGroup: PropertyGroup) => {
        children.push(...propertyGroup.children);
        if (propertyGroup.children.length) {
            propertyGroup.children.forEach((id) => {
                const group = propertyMap.get(id);
                if (group) {
                    findChildren(group);
                }
            });
        }
    };

    const onClick = () => {
        if (deleteContents) {
            openModal({
                title: "Confirm Deletion",
                children: (
                    <GroupDeleteConfirm contentTemplateId={contentTemplateId} groupId={groupId} />
                ),
            });
        } else {
            mutateAsync({
                contentTemplateId: contentTemplateId,
                deleteContents: !!deleteContents,
                groupId: `${groupId}`,
            });
        }
    };

    return (
        <>
            {component ? (
                React.cloneElement(component, { onClick })
            ) : (
                <Button onClick={onClick}>Delete Group</Button>
            )}
        </>
    );
};
