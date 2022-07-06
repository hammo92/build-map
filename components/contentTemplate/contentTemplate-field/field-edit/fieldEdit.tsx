import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { IconTitle } from "@components/ui/iconTitle/iconTitle";
import { useUpdateContentTemplateField } from "@data/contentTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { ActionIcon, Group, Modal } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import { FC, useState } from "react";
import { splitCamel } from "utils/stringTransform";
import { useSnapshot } from "valtio";
import { FieldProperties } from "../field-properties";

interface FieldEditProps {
    field: ContentTemplateField;
}

export const FieldEdit: FC<FieldEditProps> = ({ field }) => {
    const [opened, setOpened] = useState(false);
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const { mutateAsync, isLoading } = useUpdateContentTemplateField();
    const onSubmit = async (values: any) => {
        await mutateAsync({
            fieldProperties: values,
            contentTemplateId: contentTemplateId,
        });
        setOpened(false);
    };

    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                size="xl"
                closeOnClickOutside={false}
                title={
                    <IconTitle
                        icon={FIELD_TYPES[field.type]["icon"]}
                        title={`Update ${splitCamel(field.type)} Field`}
                    />
                }
            >
                <Group direction="column" grow>
                    <FieldProperties
                        initialData={field}
                        onSubmit={onSubmit}
                        action="edit"
                        isSubmitting={isLoading}
                        onCancel={() => setOpened(false)}
                    />
                </Group>
            </Modal>
            <ActionIcon onClick={() => setOpened(true)}>
                <FontAwesomeIcon icon={faEdit} />
            </ActionIcon>
        </>
    );
};
