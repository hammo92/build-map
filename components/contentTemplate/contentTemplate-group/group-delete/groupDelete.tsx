import { TreeItem } from "@atlaskit/tree";
import { useDeletePropertyGroup } from "@data/contentTemplate/hooks";
import { faFolderHeart, faFolderXmark, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Group, Menu, Modal, Stack } from "@mantine/core";
import { iteratorSymbol } from "immer/dist/internal";
import React, { useState } from "react";
import { CleanedCamel } from "type-helpers";

interface GroupDeleteProps {
    group: TreeItem;
}

export const GroupDelete = ({ group }: GroupDeleteProps) => {
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useDeletePropertyGroup();
    const onDelete = () => {
        if (group.hasChildren) {
            setOpened(true);
        }
    };
    return (
        <Menu shadow="md" withinPortal={true}>
            <Menu.Target>
                <ActionIcon color="red">
                    <FontAwesomeIcon icon={faTrash} />
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                <Menu.Label>Delete Group</Menu.Label>
                <Menu.Item
                    icon={<FontAwesomeIcon icon={faFolderHeart} />}
                    onClick={() => {
                        mutateAsync({
                            contentTemplateId: group.data.templateId,
                            deleteContents: false,
                            groupId: `${group.id}`,
                        });
                    }}
                >
                    Keep Contents
                </Menu.Item>
                <Menu.Item
                    color="red"
                    icon={<FontAwesomeIcon icon={faFolderXmark} />}
                    onClick={() => {
                        mutateAsync({
                            contentTemplateId: group.data.templateId,
                            deleteContents: true,
                            groupId: `${group.id}`,
                        });
                    }}
                >
                    Delete Contents
                </Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
