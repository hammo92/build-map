import { useDeleteContentType } from "@data/contentType/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Paper } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { useSnapshot } from "valtio";
import { ContentTypeTitle } from "../contentType-title";

export const ContentTypeDelete = () => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const modals = useModals();
    const { mutateAsync } = useDeleteContentType();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            id: "contentTypeDeleteModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: "xl",
            groupProps: { grow: true },
            confirmProps: { color: "red" },
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await mutateAsync(contentTypeId);
                contentTypeState.contentTypeId = "";
                modals.closeAll();
            },
            children: (
                <Paper>
                    <ContentTypeTitle editable={false} />
                </Paper>
            ),
        });
    return (
        <ActionIcon
            variant="light"
            color="red"
            size="lg"
            onClick={() => {
                openDeleteModal();
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
    );
};
