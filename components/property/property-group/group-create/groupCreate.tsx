import { SmartForm } from "@components/smartForm";
import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { createGroup } from "@state/propertyManager";
import React from "react";

interface GroupCreateBaseProps {
    parentId?: string;
    onCreate?: ({ name, parentId }: { name: string; parentId?: string }) => void;
}

interface GroupCreateProps extends GroupCreateBaseProps {
    component?: React.ReactElement;
}

interface GroupCreateFormProps extends GroupCreateBaseProps {}

const GroupCreateForm = ({ parentId, onCreate }: GroupCreateFormProps) => {
    return (
        <SmartForm
            formName="ContentTemplate Group Name"
            onSubmit={async (values: { name: string }) => {
                onCreate
                    ? onCreate({ name: values.name, parentId })
                    : createGroup({ name: values.name, parentId });
                closeAllModals();
            }}
        >
            <Stack>
                <SmartForm.TextInput name="name" required />
                <Group grow>
                    <Button onClick={() => closeAllModals()} variant="light" color="gray">
                        Cancel
                    </Button>
                    <Button type="submit">Create</Button>
                </Group>
            </Stack>
        </SmartForm>
    );
};

export const GroupCreate = ({ parentId, component, onCreate }: GroupCreateProps) => {
    const onClick = () => {
        openModal({
            title: "Enter group name",
            children: <GroupCreateForm parentId={parentId} onCreate={onCreate} />,
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
