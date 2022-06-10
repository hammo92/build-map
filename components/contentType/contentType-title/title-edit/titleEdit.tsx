import React, { useState } from "react";
import { useModals } from "@mantine/modals";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { useSnapshot } from "valtio";
import { contentTypeState } from "@state/contentType";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateContentType } from "@data/contentType/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { Keys } from "@data/contentType/constants";
import { ContentTypeResponse } from "@data/contentType/queries";
import { useQueryClient } from "react-query";

// component with state has to be outside modal
const ModalContents = () => {
    const modals = useModals();
    const queryClient = useQueryClient();
    const { contentTypeId } = useSnapshot(contentTypeState);
    const data = queryClient.getQueryData<ContentTypeResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTypeId,
    ]);
    const [name, setName] = useState(data?.contentType.name);
    const [loading, setLoading] = useState(false);
    const { mutateAsync } = useUpdateContentType();
    const onConfirm = async () => {
        setLoading(true);
        const fieldDetails = await mutateAsync({
            name,
            contentTypeId,
        });
        fieldDetails ? modals.closeAll() : setLoading(false);
    };
    return (
        <Group grow direction="column">
            <TextInput
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
            />
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
        </Group>
    );
};

export const TitleEdit = () => {
    const modals = useModals();

    const openTitleModal = () =>
        modals.openModal({
            title: "Update content type name",
            id: "contentTypeNameModal",
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