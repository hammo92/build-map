import { IconPicker } from "@components/ui/iconPicker";
import { useUpdateContentType } from "@data/contentType/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ContentType,
    ContentTypeIcon,
} from "@lib/contentType/data/contentType.model";
import { ActionIcon, Button, Group, Modal, ThemeIcon } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

export const IconEdit = ({
    defaultValue,
}: {
    defaultValue: ContentTypeIcon;
}) => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const [icon, setIcon] = useState<ContentTypeIcon>(defaultValue);
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useUpdateContentType();
    useEffect(() => {
        setIcon(defaultValue);
    }, [defaultValue]);

    const previewIcon = (
        <ThemeIcon color={icon?.color} variant="filled" size={36}>
            {icon?.icon ? <FontAwesomeIcon icon={icon?.icon} size="lg" /> : ""}
        </ThemeIcon>
    );

    const onCancel = () => {
        setIcon(defaultValue);
        setOpened(false);
    };

    const onConfirm = async () => {
        if (icon.icon && icon.color) {
            await mutateAsync({
                contentTypeId,
                icon,
            });
            setOpened(false);
        }
    };

    return (
        <>
            <ActionIcon
                color={icon?.color}
                variant="filled"
                size={36}
                onClick={() => setOpened(true)}
            >
                {icon?.icon ? (
                    <FontAwesomeIcon icon={icon?.icon} size="lg" />
                ) : (
                    ""
                )}
            </ActionIcon>
            <Modal
                opened={opened}
                onClose={onCancel}
                size="lg"
                title={
                    <Group>
                        {previewIcon}
                        <p>Select icon and colour</p>
                    </Group>
                }
            >
                <Group direction="column" grow>
                    <IconPicker value={icon} onChange={setIcon} />
                    <Group grow>
                        <Button
                            color="gray"
                            onClick={onCancel}
                            disabled={isLoading}
                        >
                            Cancel
                        </Button>
                        <Button
                            onClick={onConfirm}
                            disabled={isLoading}
                            loading={isLoading}
                        >
                            Update
                        </Button>
                    </Group>
                </Group>
            </Modal>
        </>
    );
};
