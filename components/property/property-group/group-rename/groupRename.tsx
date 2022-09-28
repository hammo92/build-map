import React from "react";

import { SmartForm } from "@components/smartForm";
import { Button, Group, Stack } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { propertyManager, updateGroup } from "@state/propertyManager";
import { useSnapshot } from "valtio";

interface GroupRenameProps {
    groupId: string;
    component?: React.ReactElement;
}

interface GroupCreateFormProps {
    groupId: string;
}

const GroupRenameForm = ({ groupId }: GroupCreateFormProps) => {
    const { propertyGroupMap } = useSnapshot(propertyManager);
    return (
        <SmartForm
            formName="ContentTemplate Group Name"
            onSubmit={(values: { name: string }) => {
                updateGroup({ groupId, name: values.name });
                closeAllModals();
            }}
        >
            <Stack>
                <SmartForm.TextInput
                    defaultValue={propertyGroupMap[groupId].name}
                    name="name"
                    required
                />
                <Group grow>
                    <Button onClick={() => closeAllModals()} variant="light" color="gray">
                        Cancel
                    </Button>
                    <Button type="submit">Update</Button>
                </Group>
            </Stack>
        </SmartForm>
    );
};

export const GroupRename = ({ groupId, component }: GroupRenameProps) => {
    const onClick = () => {
        openModal({
            title: "Enter group name",
            children: <GroupRenameForm groupId={groupId} />,
        });
    };

    return (
        <>
            {component ? (
                React.cloneElement(component, { onClick })
            ) : (
                <Button onClick={onClick}>Rename Group</Button>
            )}
        </>
    );
};
