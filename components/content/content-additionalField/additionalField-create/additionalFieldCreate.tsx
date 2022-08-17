import { getFieldDefaults } from "@components/contentTemplate/contentTemplate-field/field-create/create-utils/getFieldDefaults";
import { SelectFieldType } from "@components/contentTemplate/contentTemplate-field/field-create/selectFieldType";
import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { FieldProperties } from "@components/contentTemplate/contentTemplate-field/field-properties";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useUpdateContentFields } from "@data/content/hooks";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content } from "@lib/content/data/content.model";
import { ActionIcon, Button, Stack } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { splitCamel } from "utils/stringTransform";

export const AdditionalFieldCreate: FC<{
    content: CleanedCamel<Content>;
    variant: "button" | "icon";
}> = ({ content, variant = "button" }) => {
    const modals = useModals();
    const { mutateAsync, isLoading } = useUpdateContentFields();

    const onSubmit = async (newField: any) => {
        const data = await mutateAsync({
            contentId: content.id,
            updates: [{ ...newField, category: "additional" }],
        });
        if (data.content) {
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
                        fieldOptions={{
                            relation: {
                                basic: {
                                    oneWayOnly: true,
                                },
                            },
                        }}
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
                Add Field
            </Button>
        );
    return (
        <ActionIcon onClick={() => openTypeSelectModal()} color="blue" variant="light" size="lg">
            <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
    );
};
