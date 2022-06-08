import { FIELD_TYPES } from "@components/formTemplate/constants";
import { useUpdateFormTemplateField } from "@data/formTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";
import { ActionIcon, Button, Group, ThemeIcon, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { formTemplateState } from "@state/formTemplate";
import React, { FC, ReactElement, useState } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FieldDetails } from "../field-details";

interface FieldEditProps {
    field: FormTemplateField;
}

const ModalButtons = ({ cancelAction }: { cancelAction: () => void }) => {
    const modals = useModals();
    const notifications = useNotifications();
    const { mutateAsync, error } = useUpdateFormTemplateField();
    const { fieldDetails, formTemplateId } = useSnapshot(formTemplateState);
    const [loading, setLoading] = useState(false);
    const onConfirm = async () => {
        // Janky workaround for typescript possibly undefined
        setLoading(true);
        const { id } = fieldDetails;
        if (id) {
            await mutateAsync({
                fieldDetails: { ...fieldDetails, id },
                formTemplateId: formTemplateId,
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
                disabled={loading}
            >
                Cancel
            </Button>
            <Button onClick={() => onConfirm()} loading={loading}>
                Update
            </Button>
        </Group>
    );
};

const DetailsModalTitle = () => {
    const {
        fieldDetails: { type },
    } = useSnapshot(formTemplateState);
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
                    {
                        // Create button needs updated state data so cannot be inside the modal
                        // component as modal state is frozen
                    }
                    <ModalButtons cancelAction={modals.closeAll} />
                </Group>
            ),
        });

    return (
        <ActionIcon
            onClick={() => {
                // set field details into state on click
                formTemplateState.fieldDetails = field;
                openDetailsModal();
            }}
        >
            <FontAwesomeIcon icon={faEdit} />
        </ActionIcon>
    );
};
