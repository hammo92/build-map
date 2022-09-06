import { TreeData } from "@atlaskit/tree";
import {
    transformTemplateToTree,
    transformTreeGroupsToModel,
} from "@components/contentTemplate/utils/dataTransforms";
import { SmartForm } from "@components/smartForm";
import { useUpdatePropertyGroups } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button, Group, Modal, Stack } from "@mantine/core";
import React, { useState } from "react";
import { CleanedCamel } from "type-helpers";
import { ulid } from "ulid";

interface GroupCreateProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
    parentId?: string;
}

const createGroup = ({
    tree,
    parentId = "1",
    name,
}: {
    tree: TreeData;
    parentId?: string | number;
    name: string;
}) => {
    const clone = structuredClone(tree);
    const id = ulid();

    const newItem = {
        id,
        children: [],
        hasChildren: true,
        isExpanded: true,
        isChildrenLoading: false,
        repeatable: false,
        data: {
            title: name,
            type: "group",
        },
    };

    clone.items[id] = newItem;

    // push to parent group, defaults to "1" which is root
    clone.items[parentId].children.push(id);

    return clone;
};

export const GroupCreate = ({ contentTemplate, parentId }: GroupCreateProps) => {
    const tree = transformTemplateToTree(contentTemplate);
    const { mutateAsync, isLoading } = useUpdatePropertyGroups();
    const [opened, setOpened] = useState(false);

    return (
        <>
            <Modal opened={opened} onClose={() => setOpened(false)} title="Group Name">
                <SmartForm
                    formName="ContentTemplate Group Name"
                    onSubmit={async (values: { name: string }) => {
                        const groups = createGroup({
                            tree,
                            parentId,
                            name: values.name,
                        });
                        const propertyGroups = transformTreeGroupsToModel(groups);
                        await mutateAsync({
                            contentTemplateId: contentTemplate.id,
                            propertyGroups,
                        });
                        setOpened(false);
                    }}
                >
                    <Stack>
                        <SmartForm.TextInput name="name" required />
                        <Group grow>
                            <Button
                                onClick={() => setOpened(false)}
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
            </Modal>
            <Button onClick={() => setOpened(true)}>Create Group</Button>
        </>
    );
};
