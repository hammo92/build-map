import { Button, Code, Group, Stack, Text } from "@mantine/core";
import { closeAllModals, openModal } from "@mantine/modals";
import { deleteGroup, propertyManager } from "@state/propertyManager";
import React from "react";
import { useSnapshot } from "valtio";

interface GroupDeleteProps {
    groupId: string;
    component?: React.ReactElement;
    deleteContents?: boolean;
}
interface GroupDeleteFormProps {
    groupId: string;
    deleteContents?: boolean;
}

const GroupDeleteConfirm = ({ groupId, deleteContents = false }: GroupDeleteFormProps) => {
    const { propertyGroupMap } = useSnapshot(propertyManager);
    const group = propertyGroupMap[groupId];
    const parent = propertyGroupMap[group.parent];
    return (
        <Stack>
            <Text>
                This will delete <Code>{group.name}</Code>
                {deleteContents ? (
                    ` including all nested groups and fields`
                ) : (
                    <>
                        &nbsp;and move all children to <Code>{parent.name ?? "root level"}</Code>
                    </>
                )}
            </Text>
            <Group grow>
                <Button onClick={() => closeAllModals()} variant="light" color="gray">
                    Cancel
                </Button>
                <Button
                    onClick={() => {
                        deleteGroup({ groupId, deleteContents });
                        closeAllModals();
                    }}
                >
                    Continue
                </Button>
            </Group>
        </Stack>
    );
};

export const GroupDelete = ({ groupId, deleteContents, component }: GroupDeleteProps) => {
    const onClick = () => {
        openModal({
            title: "Confirm Group Deletion",
            children: <GroupDeleteConfirm groupId={groupId} deleteContents={deleteContents} />,
        });
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
