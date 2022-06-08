import { Keys } from "@data/formTemplate/constants";
import { useDeleteFormTemplate } from "@data/formTemplate/hooks";
import { FormTemplateResponse } from "@data/formTemplate/queries";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Paper, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { formTemplateState } from "@state/formTemplate";
import React from "react";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { FormTemplateTitle } from "../formTemplate-title";

export const FormTemplateDelete = () => {
    const { formTemplateId } = useSnapshot(formTemplateState);
    const modals = useModals();
    const { mutateAsync } = useDeleteFormTemplate();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            id: "formTemplateDeleteModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: "xl",
            groupProps: { grow: true },
            confirmProps: { color: "red" },
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await mutateAsync(formTemplateId);
                formTemplateState.formTemplateId = "";
                modals.closeAll();
            },
            children: (
                <Paper>
                    <FormTemplateTitle editable={false} />
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
