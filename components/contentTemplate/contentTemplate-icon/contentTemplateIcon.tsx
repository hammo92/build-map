import { IconPicker } from "@components/ui/iconPicker";
import { Icon } from "@components/ui/iconPicker/types";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Group, Modal, Stack, ThemeIcon } from "@mantine/core";
import { useState } from "react";
import { CleanedCamel } from "type-helpers";

export const ContentTemplateIcon = ({
    contentTemplate,
    editable,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>;
    editable?: boolean;
}) => {
    const [icon, setIcon] = useState<Icon>(contentTemplate.icon);
    const [opened, setOpened] = useState(false);
    const { mutateAsync, isLoading } = useUpdateContentTemplate();

    const previewIcon = (
        <ThemeIcon color={icon?.color} variant="filled" size={36}>
            {icon?.icon ? <FontAwesomeIcon icon={icon?.icon} size="lg" /> : ""}
        </ThemeIcon>
    );

    const onCancel = () => {
        setIcon(contentTemplate.icon);
        setOpened(false);
    };

    const onConfirm = async () => {
        if (icon.icon && icon.color) {
            await mutateAsync({
                contentTemplateId: contentTemplate.id,
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
                onClick={() => {
                    editable && setOpened(true);
                }}
            >
                {icon?.icon ? <FontAwesomeIcon icon={icon?.icon} size="lg" /> : ""}
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
                <Stack>
                    <IconPicker value={icon} onChange={setIcon} />
                    <Group grow>
                        <Button color="gray" onClick={onCancel} disabled={isLoading}>
                            Cancel
                        </Button>
                        <Button onClick={onConfirm} disabled={isLoading} loading={isLoading}>
                            Update
                        </Button>
                    </Group>
                </Stack>
            </Modal>
        </>
    );
};
