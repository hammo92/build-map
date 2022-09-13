import React from "react";

import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import { useUpdatePropertyGroup } from "@data/contentTemplate/hooks";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";

interface GroupRenameProps {
    contentTemplateId: string;
    groupId?: string;
    component?: React.ReactElement;
    groupTitle: string;
}

interface GroupCreateFormProps {
    groupId?: string;
    contentTemplate: CleanedCamel<ContentTemplate>;
    groupTitle: string;
}

const GroupRenameForm = ({ groupId, contentTemplate, groupTitle }: GroupCreateFormProps) => {
    const { mutateAsync, isLoading } = useUpdatePropertyGroup();
    return (
        <SmartForm
            formName="ContentTemplate Group Name"
            onSubmit={async (values: { title: string }) => {
                await mutateAsync({
                    contentTemplateId: contentTemplate.id,
                    propertyGroupId: `${groupId}`,
                    title: values.title,
                });
                closeAllModals();
            }}
        >
            <Stack>
                <SmartForm.TextInput defaultValue={groupTitle} name="title" required />
                <Group grow>
                    <Button
                        onClick={() => closeAllModals()}
                        variant="light"
                        color="gray"
                        disabled={isLoading}
                    >
                        Cancel
                    </Button>
                    <Button type="submit" loading={isLoading} disabled={isLoading}>
                        Update
                    </Button>
                </Group>
            </Stack>
        </SmartForm>
    );
};

export const GroupRename = ({
    contentTemplateId,
    groupId,
    component,
    groupTitle,
}: GroupRenameProps) => {
    const queryClient = useQueryClient();
    const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
    const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

    if (!currentData?.contentTemplate) return null;

    const onClick = () => {
        openModal({
            title: "Enter group name",
            children: (
                <GroupRenameForm
                    contentTemplate={currentData?.contentTemplate}
                    groupId={groupId}
                    groupTitle={groupTitle}
                />
            ),
        });
    };

    return (
        <>
            {component ? (
                React.cloneElement(component, { onClick })
            ) : (
                <Button onClick={onClick}>Create Group</Button>
            )}
        </>
    );
};
