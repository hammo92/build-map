import { TreeItem } from "@atlaskit/tree";
import { PropertyCreate } from "@components/property/property-create";
import {
    faCube,
    faEllipsisV,
    faFolderHeart,
    faFolderPlus,
    faFolderXmark,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { PropertyGroup } from "@lib/field/data/field.model";
import { ActionIcon, Menu } from "@mantine/core";
import { GroupCreate } from "../group-create";
import { GroupDelete } from "../group-delete";
import { GroupRename } from "../group-rename";

interface GroupDeleteProps {
    group: TreeItem;
}

export const GroupActions = ({ group }: GroupDeleteProps) => {
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
                    groupId={`${group.id}`}
                    component={
                        <Menu.Item icon={<FontAwesomeIcon icon={faCube} />}>Rename</Menu.Item>
                    }
                />
                <Menu.Divider />
                <Menu.Label>Create</Menu.Label>
                <PropertyCreate
                    parentId={`${group.id}`}
                    isModal
                    buttonElement={
                        <Menu.Item icon={<FontAwesomeIcon icon={faCube} />}>Property</Menu.Item>
                    }
                />
                <GroupCreate
                    parentId={`${group.id}`}
                    component={
                        <Menu.Item icon={<FontAwesomeIcon icon={faFolderPlus} />}>Group</Menu.Item>
                    }
                />

                <Menu.Divider />

                {`${group.children[0]}`.includes("placeholder") ? (
                    <GroupDelete
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
                            groupId={`${group.id}`}
                            deleteContents={false}
                            component={
                                <Menu.Item icon={<FontAwesomeIcon icon={faFolderHeart} />}>
                                    Keep Contents
                                </Menu.Item>
                            }
                        />
                        <GroupDelete
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
