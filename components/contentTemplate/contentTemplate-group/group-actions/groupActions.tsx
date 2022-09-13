import { TreeItem } from "@atlaskit/tree";
import { FieldCreate } from "@components/contentTemplate/contentTemplate-field/field-create";
import { useDeletePropertyGroup } from "@data/contentTemplate/hooks";
import {
    faCube,
    faEdit,
    faEllipsisV,
    faFolder,
    faFolderHeart,
    faFolderPlus,
    faFolderXmark,
    faTrash,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Divider, Group, Menu, Modal, Stack } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import { iteratorSymbol } from "immer/dist/internal";
import React, { useState } from "react";
import { CleanedCamel } from "type-helpers";
import { GroupCreate } from "../group-create";
import { GroupDelete } from "../group-delete";
import { GroupRename } from "../group-rename";

interface GroupDeleteProps {
    group: TreeItem;
}

export const GroupActions = ({ group }: GroupDeleteProps) => {
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useDeletePropertyGroup();
    const onDelete = () => {
        if (group.hasChildren) {
            setOpened(true);
        }
    };
    return (
        <Menu shadow="md" withinPortal={true} position="right-start">
            <Menu.Target>
                <ActionIcon>
                    <FontAwesomeIcon icon={faEllipsisV} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Edit</Menu.Label>
                <GroupRename
                    contentTemplateId={group.data.templateId}
                    groupId={`${group.id}`}
                    groupTitle={group.data.title}
                    component={
                        <Menu.Item
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={() => {
                                mutateAsync({
                                    contentTemplateId: group.data.templateId,
                                    deleteContents: false,
                                    groupId: `${group.id}`,
                                });
                            }}
                        >
                            Rename
                        </Menu.Item>
                    }
                />
                <Menu.Divider />
                <Menu.Label>Create</Menu.Label>
                <FieldCreate
                    contentTemplateId={group.data.templateId}
                    groupId={`${group.id}`}
                    component={
                        <Menu.Item
                            icon={<FontAwesomeIcon icon={faCube} />}
                            onClick={() => {
                                mutateAsync({
                                    contentTemplateId: group.data.templateId,
                                    deleteContents: false,
                                    groupId: `${group.id}`,
                                });
                            }}
                        >
                            Property
                        </Menu.Item>
                    }
                />
                <GroupCreate
                    contentTemplateId={group.data.templateId}
                    parentId={`${group.id}`}
                    component={
                        <Menu.Item
                            icon={<FontAwesomeIcon icon={faFolderPlus} />}
                            onClick={() => {
                                mutateAsync({
                                    contentTemplateId: group.data.templateId,
                                    deleteContents: false,
                                    groupId: `${group.id}`,
                                });
                            }}
                        >
                            Group
                        </Menu.Item>
                    }
                />

                <Menu.Divider />

                {`${group.children[0]}`.includes("placeholder") ? (
                    <GroupDelete
                        contentTemplateId={group.data.templateId}
                        groupId={`${group.id}`}
                        deleteContents={true}
                        component={
                            <Menu.Item color="red" icon={<FontAwesomeIcon icon={faFolderXmark} />}>
                                Delete Group
                            </Menu.Item>
                        }
                    />
                ) : (
                    <>
                        <Menu.Label>Delete</Menu.Label>
                        <GroupDelete
                            contentTemplateId={group.data.templateId}
                            groupId={`${group.id}`}
                            deleteContents={false}
                            component={
                                <Menu.Item icon={<FontAwesomeIcon icon={faFolderHeart} />}>
                                    Keep Contents
                                </Menu.Item>
                            }
                        />
                        <GroupDelete
                            contentTemplateId={group.data.templateId}
                            groupId={`${group.id}`}
                            deleteContents={true}
                            component={
                                <Menu.Item
                                    color="red"
                                    icon={<FontAwesomeIcon icon={faFolderXmark} />}
                                >
                                    Delete Contents
                                </Menu.Item>
                            }
                        />
                    </>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};
