import { useCreateContent } from "@data/content/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Box, Button, Group } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";

const ContentCreateForm: FC<{
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
}> = ({ contentTemplate, projectId }) => {
    const modals = useModals();
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync, isLoading } = useCreateContent();
    return (
        <Box>
            <form
                onSubmit={form.onSubmit(async ({ name }) => {
                    const { newContent } = await mutateAsync({
                        contentTemplateId: contentTemplate.id,
                        projectId,
                    });
                    if (newContent) {
                        //set new contentTemplate as active in state
                        contentTemplateState.contentTemplateId = newContent.id;
                        modals.closeModal("contentTemplateCreateModal");
                    }
                })}
            >
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
            </form>
        </Box>
    );
};

export const ContentCreate: FC<{
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
}> = ({ contentTemplate, projectId }) => {
    const modals = useModals();

    const openCreateModal = () =>
        modals.openModal({
            title: `Create New ${contentTemplate.name}`,
            id: "contentTemplateCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: <ContentCreateForm contentTemplate={contentTemplate} projectId={projectId} />,
        });
    return (
        <Button onClick={() => openCreateModal()} variant={"filled"} color="blue">
            {`Add ${contentTemplate.name}`}
        </Button>
    );
};
