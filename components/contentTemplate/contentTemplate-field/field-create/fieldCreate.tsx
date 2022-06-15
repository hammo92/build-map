import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useCreateContentTemplateField } from "@data/contentTemplate/hooks";
import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { contentTemplateState } from "@state/contentTemplate";
import React, { FC, useEffect, useState } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FieldDetails } from "../field-details";
import { checkFieldValues } from "./create-utils/checkFieldValues";
import { getFieldDefaultConfig } from "./create-utils/setFieldDefaults";
import { SelectFieldType } from "./selectFieldType";

const ModalButtons = ({ cancelAction }: { cancelAction: () => void }) => {
    const modals = useModals();
    const notifications = useNotifications();
    const { mutateAsync, isLoading } = useCreateContentTemplateField();
    const { fieldDetails, contentTemplateId } =
        useSnapshot(contentTemplateState);

    const onConfirm = async () => {
        const { name, type } = fieldDetails;
        try {
            checkFieldValues(fieldDetails);
            await mutateAsync({
                // Janky workaround for typescript possibly undefined
                fieldDetails: { ...fieldDetails, name: name!, type: type! },
                contentTemplateId: contentTemplateId,
            });
            modals.closeAll();
        } catch (error: any) {
            notifications.showNotification({
                title: "Unable to create field",
                message:
                    error.message ?? "Have you filled all the required fields",
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
                Back
            </Button>
            <Button
                onClick={() => onConfirm()}
                loading={isLoading}
                disabled={isLoading}
            >
                Create
            </Button>
        </Group>
    );
};

export const FieldCreate: FC = () => {
    // reset state when closed
    useEffect(() => {
        return () => {
            contentTemplateState.fieldDetails = {};
        };
    }, []);

    const modals = useModals();

    const setFieldType = (type: FieldType) => {
        // reset any values when field type is changed and set field details
        contentTemplateState.fieldDetails = {
            type,
            config: getFieldDefaultConfig(type),
        };
        modals.closeModal("selectFieldType");
        openDetailsModal(type);
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

    const onBackClick = () => {
        modals.closeModal("detailsModal");
        openTypeSelectModal();
    };

    const openDetailsModal = (type: FieldType) =>
        modals.openModal({
            title: (
                <IconTitle
                    icon={FIELD_TYPES[type]["icon"]}
                    title={`New ${splitCamel(type)} Field`}
                    subtitle="Configure field options"
                />
            ),
            id: "detailsModal",
            closeOnClickOutside: false,

            size: "xl",
            children: (
                <Group direction="column" grow>
                    <FieldDetails />
                    <ModalButtons cancelAction={onBackClick} />
                </Group>
            ),
        });

    return (
        <Button
            fullWidth
            variant="light"
            color="blue"
            onClick={() => {
                openTypeSelectModal();
            }}
        >
            Add Field
        </Button>
    );
};
