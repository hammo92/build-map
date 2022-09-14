import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import { useCreatePropertyGroup } from "@data/contentTemplate/hooks";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import React from "react";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";

interface GroupCreateProps {
    contentTemplateId: string;
    parentId?: string;
    component?: React.ReactElement;
}

interface GroupCreateFormProps {
    parentId?: string;
    contentTemplate: CleanedCamel<ContentTemplate>;
}

const GroupCreateForm = ({ parentId, contentTemplate }: GroupCreateFormProps) => {
    const { mutateAsync, isLoading } = useCreatePropertyGroup();
    const { propertyGroups } = contentTemplate;
    return (
        <SmartForm
            formName="ContentTemplate Group Name"
            onSubmit={async (values: { name: string }) => {
                await mutateAsync({
                    contentTemplateId: contentTemplate.id,
                    name: values.name,
                    parentId,
                });
                closeAllModals();
            }}
        >
            <Stack>
                <SmartForm.TextInput name="name" required />
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
                        Create
                    </Button>
                </Group>
            </Stack>
        </SmartForm>
    );
};

export const GroupCreate = ({ contentTemplateId, parentId, component }: GroupCreateProps) => {
    const queryClient = useQueryClient();
    const queryId = [Keys.GET_CONTENT_TEMPLATE, contentTemplateId];
    const currentData = queryClient.getQueryData<ContentTemplateResponse>(queryId);

    if (!currentData?.contentTemplate) return null;

    const onClick = () => {
        openModal({
            title: "Enter group name",
            children: (
                <GroupCreateForm
                    contentTemplate={currentData?.contentTemplate}
                    parentId={parentId}
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