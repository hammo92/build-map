import { useCreateContent } from "@data/content/hooks";
import { Content } from "@lib/content/data/content.model";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button } from "@mantine/core";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";

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
