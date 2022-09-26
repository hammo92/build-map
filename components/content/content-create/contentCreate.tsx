import { SmartForm } from "@components/smartForm";
import { useCreateContent } from "@data/content/hooks";
import { Content } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Box, Button, Group } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import { FC, useEffect } from "react";
import { CleanedCamel } from "type-helpers";
import { ContentFields } from "../content-fields";

const ContentCreateForm: FC<{
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
}> = ({ contentTemplate, projectId }) => {
    const modals = useModals();

    const { mutateAsync, isLoading } = useCreateContent();
    const onSubmit = async (values: any) => {
        console.log("values", values);
        /*const { newContent } = await mutateAsync({
            contentTemplateId: contentTemplate.id,
            projectId,
        });
        if (newContent) {
            //set new contentTemplate as active in state
            contentTemplateState.contentTemplateId = newContent.id;
            modals.closeModal("contentTemplateCreateModal");
        }*/
    };
    return (
        <Box>
            <SmartForm onSubmit={onSubmit} formName="contentCreate">
                <ContentFields fields={contentTemplate.properties} />
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

export const ContentCreate: FC<{
    contentTemplate: CleanedCamel<ContentTemplate>;
    projectId: string;
    onCreate?: (content: CleanedCamel<Content>) => void;
}> = ({ contentTemplate, projectId, onCreate }) => {
    /*const modals = useModals();

    const openCreateModal = () =>
        modals.openModal({
            title: `Create New ${contentTemplate.name}`,
            id: "contentTemplateCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: <ContentCreateForm contentTemplate={contentTemplate} projectId={projectId} />,
        });*/
    const { mutateAsync, isLoading } = useCreateContent();
    const onClick = async () => {
        const { newContent } = await mutateAsync({
            contentTemplateId: contentTemplate.id,
            projectId,
        });
        if (newContent) {
            onCreate && onCreate(newContent);
        }
    };
    return (
        <Button
            onClick={onClick}
            variant={"filled"}
            color="blue"
            loading={isLoading}
            disabled={isLoading}
        >
            {`Add ${contentTemplate.name}`}
        </Button>
    );
};
