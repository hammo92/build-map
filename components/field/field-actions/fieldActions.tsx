import { faEdit, faEllipsisVertical, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field } from "@lib/field/data/field.model";
import { ActionIcon, Menu } from "@mantine/core";
import React from "react";
import { CleanedCamel } from "type-helpers";

export interface FieldActionsProps {
    field: CleanedCamel<Field>;
    editable?: boolean;
    removable?: boolean;
}

export const FieldActions = ({ field, editable, removable }: FieldActionsProps) => {
    const canRemove = removable && !field.templatePropertyId;
    const canEdit = editable && !field.templatePropertyId;
    return (
        <Menu shadow="md" width={200}>
            <Menu.Target>
                <ActionIcon size="lg" style={{ alignSelf: "flex-start" }} mt="25px">
                    <FontAwesomeIcon icon={faEllipsisVertical} />{" "}
                </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
                {canEdit && (
                    <Menu.Item
                        icon={<FontAwesomeIcon icon={faEdit} />}
                        onClick={() => setOpened(true)}
                    >
                        Edit
                    </Menu.Item>
                )}
                {canRemove && (
                    <Menu.Item
                        color="red"
                        icon={<FontAwesomeIcon icon={faTrash} />}
                        onClick={() => onDelete()}
                    >
                        Delete
                    </Menu.Item>
                )}
            </Menu.Dropdown>
        </Menu>
    );
};
