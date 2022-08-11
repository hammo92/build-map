import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useCreateProperty } from "@data/contentTemplate/hooks";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Button, Group, Stack } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { splitCamel } from "utils/stringTransform";
import { FieldProperties } from "../field-properties";
import { getFieldDefaults } from "./create-utils/getFieldDefaults";
import { SelectFieldType } from "./selectFieldType";

export const FieldCreate: FC<{
    contentTemplate: CleanedCamel<ContentTemplate>;
    variant: "button" | "icon";
}> = ({ contentTemplate, variant = "button" }) => {
    const modals = useModals();
    const { mutateAsync, isLoading } = useCreateProperty();

    const onSubmit = async (values: any) => {
        const data = await mutateAsync({
            fieldProperties: {
                ...values,
            },
            contentTemplateId: contentTemplate.id,
        });
        if (data.contentTemplate) {
            modals.closeAll();
        }
    };

    const setFieldType = (type: FieldType) => {
        modals.closeModal("selectFieldType");
        openPropertiesModal(type);
    };

    const openTypeSelectModal = () =>
        modals.openModal({
            title: "Select Property Type",
            children: <SelectFieldType setFieldType={setFieldType} />,
            size: "xl",
            //id: "selectFieldType",
            onClose: () => modals.closeAll(),
            closeOnClickOutside: false,
        });

    const onBackClick = () => {
        modals.closeModal("detailsModal");
        openTypeSelectModal();
    };

    const openPropertiesModal = (type: FieldType) =>
        modals.openModal({
            title: (
                <IconTitle
                    icon={FIELD_TYPES[type]["icon"]}
                    title={`New ${splitCamel(type)} Property`}
                    subtitle="Configure field options"
                />
            ),
            //id: "detailsModal",
            closeOnClickOutside: false,

            size: "xl",
            children: (
                <Stack>
                    <FieldProperties
                        initialData={getFieldDefaults(type)}
                        onCancel={onBackClick}
                        onSubmit={onSubmit}
                        isSubmitting={isLoading}
                        action="create"
                    />
                </Stack>
            ),
        });

    if (variant === "button")
        return (
            <Button
                fullWidth
                variant="light"
                color="blue"
                onClick={() => {
                    openTypeSelectModal();
                }}
            >
                Add Property
            </Button>
        );
    return (
        <ActionIcon onClick={() => openTypeSelectModal()} color="blue" variant="light" size="lg">
            <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
    );
};
