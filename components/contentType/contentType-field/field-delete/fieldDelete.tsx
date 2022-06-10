import { useDeleteContentTypeField } from "@data/contentType/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTypeField } from "@lib/contentType/data/contentType.model";
import { ActionIcon } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTypeState } from "@state/contentType";
import React, { FC } from "react";
import { useSnapshot } from "valtio";
import { FieldCard } from "../field-card";

interface FieldDeleteProps {
    field: ContentTypeField;
}

export const FieldDelete: FC<FieldDeleteProps> = ({ field }) => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const modals = useModals();
    const { mutateAsync } = useDeleteContentTypeField();
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
                    contentTypeId,
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
