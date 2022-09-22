import { SmartForm } from "@components/smartForm";
import { Icon } from "@components/ui/iconPicker/types";
import { useCreateContentTemplate } from "@data/contentTemplate/hooks";
import { faMinus, faPlus } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Box, Button, Group } from "@mantine/core";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { openModal, closeAllModals, closeModal } from "@mantine/modals";

interface ContentTemplateCreateProps {
    /** Whether the content is a collection or a component */
    templateType: ContentTemplate["templateType"];

    /** Called when create form is submitted */
    onCreate?: (template: CleanedCamel<ContentTemplate>) => void;

    /** The id of the current organisation */
    organisationId: string;
}

const ContentTemplateCreateForm: FC<ContentTemplateCreateProps> = ({
    templateType,
    onCreate,
    organisationId,
}) => {
    const { mutateAsync, isLoading } = useCreateContentTemplate();

    const onSubmit = async (values: { name: string; icon: Icon }) => {
        await mutateAsync(
            {
                name: values.name,
                organisationId,
                icon: values.icon,
                templateType,
            },
            {
                onSuccess: ({ newContentTemplate }) => {
                    onCreate && onCreate(newContentTemplate);
                    closeModal("contentTemplateCreateModal");
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
                    label={`${templateType === "collection" ? "Template" : "Component"} Name`}
                    placeholder={`eg. ${
                        templateType === "collection" ? "Scaffolding Doc" : "Address"
                    }`}
                />
                <SmartForm.IconPicker name="icon" label="Select an icon" required />
                <Group position="right" mt="md" grow>
                    <Button
                        disabled={isLoading}
                        onClick={() => closeModal("contentTemplateCreateModal")}
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

export const ContentTemplateCreate: FC<ContentTemplateCreateProps> = ({
    templateType,
    onCreate,
    organisationId,
}) => {
    const openCreateModal = () =>
        openModal({
            title: `Create New ${templateType === "collection" ? "Template" : "Component"}`,
            //id: "contentTemplateCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: (
                <ContentTemplateCreateForm
                    templateType={templateType}
                    onCreate={onCreate}
                    organisationId={organisationId}
                />
            ),
        });
    return (
        <ActionIcon onClick={() => openCreateModal()} variant={"filled"} color="blue">
            <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
    );
};
