import { useDeleteContentTemplateField } from "@data/contentTemplate/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplateField } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import React, { FC } from "react";
import { useSnapshot } from "valtio";
import { FieldCard } from "../field-card";

interface FieldDeleteProps {
    field: ContentTemplateField;
}

export const FieldDelete: FC<FieldDeleteProps> = ({ field }) => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const modals = useModals();
    const { mutateAsync } = useDeleteContentTemplateField();
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
                    contentTemplateId,
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
