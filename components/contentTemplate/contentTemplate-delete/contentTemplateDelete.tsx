import { useDeleteContentTemplate } from "@data/contentTemplate/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Paper } from "@mantine/core";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import { CleanedCamel } from "type-helpers";
import { ContentTemplateTitle } from "../contentTemplate-title";

export const ContentTemplateDelete = ({
    contentTemplate,
}: {
    contentTemplate: CleanedCamel<ContentTemplate>;
}) => {
    const modals = useModals();
    const { mutateAsync } = useDeleteContentTemplate();
    const openDeleteModal = () =>
        modals.openConfirmModal({
            title: `Are you sure you want to delete?`,
            id: "contentTemplateDeleteModal",
            closeOnClickOutside: false,
            closeOnCancel: true,
            size: "xl",
            groupProps: { grow: true },
            confirmProps: { color: "red" },
            labels: { confirm: "Delete", cancel: "Cancel" },
            onConfirm: async () => {
                await mutateAsync(contentTemplate.id);
                contentTemplateState.contentTemplateId = "";
                modals.closeAll();
            },
            children: (
                <Paper>
                    <ContentTemplateTitle editable={false} />
                </Paper>
            ),
        });
    return (
        <ActionIcon
            variant="light"
            color="red"
            size="lg"
            onClick={() => {
                openDeleteModal();
            }}
        >
            <FontAwesomeIcon icon={faTrash} />
        </ActionIcon>
    );
};
