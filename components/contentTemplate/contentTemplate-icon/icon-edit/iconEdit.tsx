import { IconPicker } from "@components/ui/iconPicker";
import { IconPickerIcon } from "@components/ui/iconPicker/types";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Group, Modal, ThemeIcon } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

export const IconEdit = ({
    defaultValue,
}: {
    defaultValue: IconPickerIcon;
}) => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const [icon, setIcon] = useState<IconPickerIcon>(defaultValue);
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useUpdateContentTemplate();
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
                contentTemplateId,
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
