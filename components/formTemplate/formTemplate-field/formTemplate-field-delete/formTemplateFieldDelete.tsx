import { useDeleteFormTemplateField } from "@data/formTemplate/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";
import { ActionIcon, Chip, Group, Text } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { formTemplateState } from "@state/formTemplate";
import React, { FC } from "react";
import { capitalise } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FormTemplateFieldCard } from "../formTemplate-field-card";

interface FormTemplateFieldDeleteProps {
    field: FormTemplateField;
}

export const FormTemplateFieldDelete: FC<FormTemplateFieldDeleteProps> = ({
    field,
}) => {
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
                await mutateAsync({ fieldId: field.id, formTemplateId });
                modals.closeAll();
            },
            children: (
                <FormTemplateFieldCard
                    withActions={false}
                    withDrag={false}
                    field={field}
                />
            ),
        });

    return (
        <ActionIcon variant="light" color="red">
            <FontAwesomeIcon
                icon={faTrash}
                onClick={() => {
                    openDeleteModal();
                }}
            />
        </ActionIcon>
    );
};
