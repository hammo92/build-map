import { FIELD_TYPES } from "@components/formTemplate/constants";
import {
    useCreateFormTemplateField,
    useUpdateFormTemplateField,
} from "@data/formTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    FieldType,
    FormTemplateField,
} from "@lib/formTemplate/data/formTemplate.model";
import {
    ActionIcon,
    Button,
    Group,
    Modal,
    ThemeIcon,
    Title,
} from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { formTemplateState } from "@state/formTemplate";
import React, { FC, ReactElement, useEffect } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FormTemplateFieldDetails } from "../formTemplate-field-details";

interface FormTemplateFieldEditProps {
    field: FormTemplateField;
}

const ModalButtons = ({
    cancelButton,
}: {
    cancelButton: ReactElement<any, any>;
}) => {
    const modals = useModals();
    const notifications = useNotifications();
    const { mutateAsync, error } = useUpdateFormTemplateField();
    const { fieldDetails, formTemplateId } = useSnapshot(formTemplateState);
    const onConfirm = async () => {
        // Janky workaround for typescript possibly undefined
        const { id } = fieldDetails;
        if (id) {
            await mutateAsync({
                fieldDetails: { ...fieldDetails, id },
                formTemplateId,
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
            {cancelButton}
            <Button onClick={() => onConfirm()}>Update</Button>
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

export const FormTemplateFieldEdit: FC<FormTemplateFieldEditProps> = ({
    field,
}) => {
    const modals = useModals();

    const openDetailsModal = () =>
        modals.openModal({
            title: <DetailsModalTitle />,
            id: "detailsModal",
            closeOnClickOutside: false,
            size: "xl",
            children: (
                <Group direction="column" grow>
                    <FormTemplateFieldDetails />
                    {
                        // Create button needs updated state data so cannot be inside the modal
                        // component as modal state is frozen
                    }
                    <ModalButtons
                        cancelButton={
                            <Button
                                variant="light"
                                color="gray"
                                onClick={() => {
                                    modals.closeAll();
                                }}
                            >
                                Cancel
                            </Button>
                        }
                    />
                </Group>
            ),
        });

    return (
        <ActionIcon>
            <FontAwesomeIcon
                icon={faEdit}
                onClick={() => {
                    formTemplateState.fieldDetails = field;
                    openDetailsModal();
                }}
            />
        </ActionIcon>
    );
};
