import { SmartForm } from "@components/smartForm";
import { IconPickerIcon } from "@components/ui/iconPicker/types";
import { useCreateContentTemplate } from "@data/contentTemplate/hooks";
import { faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Box, Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";

interface ContentTemplateCreateProps {
    type: ContentTemplate["type"];
    onCreate?: (template: CleanedCamel<ContentTemplate>) => void;
    organisationId: string;
}

const ContentTemplateCreateForm: FC<ContentTemplateCreateProps> = ({ type, onCreate, organisationId }) => {
    const modals = useModals();
    const { mutateAsync, isLoading } = useCreateContentTemplate();

    const onSubmit = async (values: { name: string; icon: IconPickerIcon }) => {
        await mutateAsync(
            {
                name: values.name,
                organisationId,
                icon: values.icon,
                type,
            },
            {
                onSuccess: ({ newContentTemplate }) => {
                    onCreate && onCreate(newContentTemplate);
                    modals.closeModal("contentTemplateCreateModal");
                },
            }
        );
    };

    return (
        <Box>
            <SmartForm formName="create content template" onSubmit={onSubmit}>
                <SmartForm.TextInput
                    name="name"
                    required
                    label={`${type === "collection" ? "Template" : "Component"} Name`}
                    placeholder={`eg. ${type === "collection" ? "Scaffolding Doc" : "Address"}`}
                />
                <SmartForm.IconPicker name="icon" label="Select an icon" required />
                <Group position="right" mt="md" grow>
                    <Button
                        disabled={isLoading}
                        onClick={() => modals.closeModal("contentTemplateCreateModal")}
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button disabled={isLoading} loading={isLoading} type="submit">
                        Submit
                    </Button>
                </Group>
            </SmartForm>
        </Box>
    );
};

export const ContentTemplateCreate: FC<ContentTemplateCreateProps> = ({ type, onCreate, organisationId }) => {
    const modals = useModals();

    const openCreateModal = () =>
        modals.openModal({
            title: `Create New ${type === "collection" ? "Template" : "Component"}`,
            id: "contentTemplateCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: <ContentTemplateCreateForm type={type} onCreate={onCreate} organisationId={organisationId} />,
        });
    return (
        <ActionIcon onClick={() => openCreateModal()} variant={"filled"} color="blue">
            <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
    );
};
