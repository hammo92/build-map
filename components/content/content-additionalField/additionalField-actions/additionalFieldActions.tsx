import { FIELD_TYPES } from "@components/property/property-type/type-select/options";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useUpdateContentFields } from "@data/content/hooks";
import { faEdit, faEllipsisVertical, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";

import { ActionIcon, Button, Menu, Modal, Stack, UnstyledButton } from "@mantine/core";
import { FC, useState } from "react";
import { CleanedCamel } from "type-helpers";
import { splitCamel } from "utils/stringTransform";

interface FieldEditProps {
    field: ContentField;
    contentId: string;
    editable?: boolean;
    removable?: boolean;
}

export const AdditionalFieldActions: FC<FieldEditProps> = ({
    field,
    contentId,
    editable,
    removable,
}) => {
    console.log("editable", editable);
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useUpdateContentFields();

    const onSubmit = async (updatedField: any) => {
        const data = await mutateAsync({
            contentId,
            updates: [updatedField],
        });
        if (data.content) {
            setOpened(false);
        }
    };

    const onDelete = async () => {
        const data = await mutateAsync({
            contentId,
            deletions: [field],
        });
        if (data.content) {
            setOpened(false);
        }
    };

    return (
        <>
            <Menu shadow="md" width={200}>
                <Menu.Target>
                    <ActionIcon size="lg" style={{ alignSelf: "flex-start" }} mt="25px">
                        <FontAwesomeIcon icon={faEllipsisVertical} />{" "}
                    </ActionIcon>
                </Menu.Target>
                <Menu.Dropdown>
                    {editable && (
                        <Menu.Item
                            icon={<FontAwesomeIcon icon={faEdit} />}
                            onClick={() => setOpened(true)}
                        >
                            Edit
                        </Menu.Item>
                    )}
                    {removable && (
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

            {/* <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                size="xl"
                closeOnClickOutside={false}
                title={
                    <IconTitle
                        icon={FIELD_TYPES[field.type]["icon"]}
                        title={`Update ${splitCamel(field.type)} Property`}
                    />
                }
            >
                <Stack>
                    <FieldProperties
                        initialData={field}
                        onSubmit={onSubmit}
                        isSubmitting={isLoading}
                        action="edit"
                        fieldOptions={{
                            relation: {
                                basic: {
                                    oneWayOnly: true,
                                    relationLocked: true,
                                },
                            },
                            image: {
                                basic: {
                                    variantLocked:
                                        field.type === "image" &&
                                        field.variant === "multiple" &&
                                        field.value &&
                                        field.value.length > 1,
                                },
                            },
                        }}
                    />
                </Stack>
            </Modal> */}
        </>
    );
};
