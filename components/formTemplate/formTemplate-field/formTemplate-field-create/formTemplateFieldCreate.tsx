import { FIELD_TYPES } from "@components/formTemplate/constants";
import { useCreateFormTemplateField } from "@data/formTemplate/hooks";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FieldType } from "@lib/formTemplate/data/formTemplate.model";
import { Button, Group, Modal, ThemeIcon, Title } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { formTemplateState } from "@state/formTemplate";
import React, { FC, ReactElement, useEffect } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FormTemplateFieldDetails } from "../formTemplate-field-details";
import { SelectFieldType } from "./selectFieldType";

const ModalButtons = ({
    backButton,
}: {
    backButton: ReactElement<any, any>;
}) => {
    const modals = useModals();
    const notifications = useNotifications();
    const { mutateAsync, error } = useCreateFormTemplateField();
    const { fieldDetails, formTemplateId } = useSnapshot(formTemplateState);
    const onConfirm = async () => {
        // Janky workaround for typescript possibly undefined
        const { name, type } = fieldDetails;
        if (type && name) {
            await mutateAsync({
                fieldDetails: { ...fieldDetails, name, type },
                formTemplateId,
            });
            modals.closeAll();
        } else {
            notifications.showNotification({
                title: "Unable to create field",
                message: error ?? "Have you filled all the required fields",
                color: "red",
            });
        }
    };
    return (
        <Group grow>
            {backButton}
            <Button onClick={() => onConfirm()}>Create</Button>
        </Group>
    );
};

const DetailsModalTitle = () => {
    const {
        fieldDetails: { type },
    } = useSnapshot(formTemplateState);
    if (type)
        return (
            <Group>
                <ThemeIcon>
                    <FontAwesomeIcon icon={FIELD_TYPES[type]["icon"]} />
                </ThemeIcon>
                <Title
                    order={3}
                    sx={{ textTransform: "capitalize" }}
                >{`New ${splitCamel(type)} Field`}</Title>
            </Group>
        );
    return null;
};

export const FormTemplateFieldCreate: FC = () => {
    useEffect(() => {
        return () => {
            formTemplateState.fieldDetails = {};
        };
    }, []);

    const modals = useModals();

    const setFieldType = (type: FieldType) => {
        // don't use update so other details reset
        formTemplateState.fieldDetails = { type };
        modals.closeModal("selectFieldType");
        openDetailsModal();
    };

    const openTypeSelectModal = () =>
        modals.openModal({
            title: "Select Field Type",
            children: <SelectFieldType setFieldType={setFieldType} />,
            size: "xl",
            id: "selectFieldType",
            onClose: () => modals.closeAll(),
            closeOnClickOutside: false,
        });

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
                        backButton={
                            <Button
                                variant="light"
                                color="gray"
                                onClick={() => {
                                    modals.closeModal("detailsModal");
                                    openTypeSelectModal();
                                }}
                            >
                                Back
                            </Button>
                        }
                    />
                </Group>
            ),
        });

    return (
        <Button
            fullWidth
            variant="light"
            color="teal"
            onClick={() => {
                openTypeSelectModal();
            }}
        >
            Add Field
        </Button>
    );
};
