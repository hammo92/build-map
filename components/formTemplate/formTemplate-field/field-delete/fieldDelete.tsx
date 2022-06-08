import { useDeleteFormTemplateField } from "@data/formTemplate/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";
import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { formTemplateState } from "@state/formTemplate";
import React, { FC } from "react";
import { useSnapshot } from "valtio";
import { FieldCard } from "../field-card";

interface FieldDeleteProps {
    field: FormTemplateField;
}

export const FieldDelete: FC<FieldDeleteProps> = ({ field }) => {
    const { formTemplateId } = useSnapshot(formTemplateState);
    const modals = useModals();
    const { mutateAsync } = useDeleteFormTemplateField();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            id: "detailsModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: "xl",
            groupProps: { grow: true },
            confirmProps: { color: "red" },
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await mutateAsync({
                    fieldId: field.id,
                    formTemplateId,
                });
                modals.closeAll();
            },
            children: (
                <FieldCard withActions={false} withDrag={false} field={field} />
            ),
        });

    return (
        <ActionIcon
            color="red"
            onClick={() => {
                openDeleteModal();
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
    );
};
