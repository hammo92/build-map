import { FIELD_TYPES } from "@components/contentType/constants";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useCreateContentTypeField } from "@data/contentType/hooks";
import { FieldType } from "@components/contentType/constants";
import { Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { useNotifications } from "@mantine/notifications";
import { contentTypeState } from "@state/contentType";
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
    const { mutateAsync, error } = useCreateContentTypeField();
    const { fieldDetails, contentTypeId } = useSnapshot(contentTypeState);
    const [loading, setLoading] = useState(false);
    const onConfirm = async () => {
        setLoading(true);
        const { name, type } = fieldDetails;
        try {
            checkFieldValues(fieldDetails);
            await mutateAsync({
                // Janky workaround for typescript possibly undefined
                fieldDetails: { ...fieldDetails, name: name!, type: type! },
                contentTypeId: contentTypeId,
            });
            modals.closeAll();
        } catch (error: any) {
            setLoading(false);
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
                disabled={loading}
            >
                Back
            </Button>
            <Button onClick={() => onConfirm()} loading={loading}>
                Create
            </Button>
        </Group>
    );
};

export const FieldCreate: FC = () => {
    // reset state when closed
    useEffect(() => {
        return () => {
            contentTypeState.fieldDetails = {};
        };
    }, []);

    const modals = useModals();

    const setFieldType = (type: FieldType) => {
        // reset any values when field type is changed and set field details
        contentTypeState.fieldDetails = {
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
                    {
                        // Create button needs updated state data so cannot be inside the modal
                        // component as modal state is frozen
                    }
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
