import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { useUpdateContentTemplateField } from "@data/contentTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplateField } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Group, ThemeIcon, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { contentTemplateState } from "@state/contentTemplate";
import React, { FC, ReactElement, useState } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FieldDetails } from "../field-details";

interface FieldEditProps {
    field: ContentTemplateField;
}

const ModalButtons = ({ cancelAction }: { cancelAction: () => void }) => {
    const modals = useModals();
    const notifications = useNotifications();
    const { mutateAsync, error, isLoading } = useUpdateContentTemplateField();
    const { fieldDetails, contentTemplateId } =
        useSnapshot(contentTemplateState);
    const onConfirm = async () => {
        // Janky workaround for typescript possibly undefined from Valtio
        const { id } = fieldDetails;
        if (id) {
            await mutateAsync({
                fieldDetails: { ...fieldDetails, id },
                contentTemplateId: contentTemplateId,
            });
            modals.closeAll();
        } else {
            notifications.showNotification({
                title: "Unable to update field",
                message: error ?? "Please try again later",
                color: "red",
            });
        }
    };
    return (
        <Group grow>
            <Button
                variant="light"
                color="gray"
                onClick={() => cancelAction()}
                disabled={isLoading}
            >
                Cancel
            </Button>
            <Button
                onClick={() => onConfirm()}
                loading={isLoading}
                disabled={isLoading}
            >
                Update
            </Button>
        </Group>
    );
};

const DetailsModalTitle = () => {
    const {
        fieldDetails: { type },
    } = useSnapshot(contentTemplateState);
    if (type) {
        return (
            <Group>
                <ThemeIcon>
                    <FontAwesomeIcon icon={FIELD_TYPES[type]["icon"]} />
                </ThemeIcon>
                <Title
                    order={3}
                    sx={{ textTransform: "capitalize" }}
                >{`Update ${splitCamel(type)} Field`}</Title>
            </Group>
        );
    }
    return null;
};

export const FieldEdit: FC<FieldEditProps> = ({ field }) => {
    const modals = useModals();

    const openDetailsModal = () =>
        modals.openModal({
            title: <DetailsModalTitle />,
            id: "detailsModal",
            closeOnClickOutside: false,
            size: "xl",
            children: (
                <Group direction="column" grow>
                    <FieldDetails />
                    <ModalButtons cancelAction={modals.closeAll} />
                </Group>
            ),
        });

    return (
        <ActionIcon
            onClick={() => {
                // set field details into state on click
                contentTemplateState.fieldDetails = field;
                openDetailsModal();
            }}
        >
            <FontAwesomeIcon icon={faEdit} />
        </ActionIcon>
    );
};
