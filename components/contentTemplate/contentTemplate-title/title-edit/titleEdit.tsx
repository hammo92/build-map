import React, { useState } from "react";
import { useModals } from "@mantine/modals";
import { ActionIcon, Button, Group, Stack, TextInput } from "@mantine/core";
import { useSnapshot } from "valtio";
import { contentTemplateState } from "@state/contentTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { useQueryClient } from "react-query";

// component with state has to be outside modal
const ModalContents = () => {
    const modals = useModals();
    const queryClient = useQueryClient();
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const data = queryClient.getQueryData<ContentTemplateResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTemplateId,
    ]);
    const [name, setName] = useState(data?.contentTemplate.name);
    const [loading, setLoading] = useState(false);
    const { mutateAsync } = useUpdateContentTemplate();
    const onConfirm = async () => {
        setLoading(true);
        const fieldProperties = await mutateAsync({
            name,
            contentTemplateId,
        });
        fieldProperties ? modals.closeAll() : setLoading(false);
    };
    return (
        <Stack>
            <TextInput value={name} onChange={(event) => setName(event.currentTarget.value)} />
            <Group grow>
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => modals.closeAll()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button onClick={() => onConfirm()} loading={loading}>
                    Update
                </Button>
            </Group>
        </Stack>
    );
};

export const TitleEdit = () => {
    const modals = useModals();

    const openTitleModal = () =>
        modals.openModal({
            title: "Update content template name",
            //id: "contentTemplateNameModal",
            closeOnClickOutside: false,
            size: "xl",

            children: <ModalContents />,
        });

    return (
        <ActionIcon onClick={() => openTitleModal()}>
            <FontAwesomeIcon icon={faEdit} />
        </ActionIcon>
    );
};
