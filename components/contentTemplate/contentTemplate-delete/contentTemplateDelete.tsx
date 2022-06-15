import { useDeleteContentTemplate } from "@data/contentTemplate/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Paper } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { useSnapshot } from "valtio";
import { ContentTemplateTitle } from "../contentTemplate-title";

export const ContentTemplateDelete = () => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const modals = useModals();
    const { mutateAsync } = useDeleteContentTemplate();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            id: "contentTemplateDeleteModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: "xl",
            groupProps: { grow: true },
            confirmProps: { color: "red" },
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await mutateAsync(contentTemplateId);
                contentTemplateState.contentTemplateId = "";
                modals.closeAll();
            },
            children: (
                <Paper>
                    <ContentTemplateTitle editable={false} />
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
