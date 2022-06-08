import React, { useState } from "react";
import { useModals } from "@mantine/modals";
import { ActionIcon, Button, Group, TextInput } from "@mantine/core";
import { useSnapshot } from "valtio";
import { formTemplateState } from "@state/formTemplate";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useUpdateFormTemplate } from "@data/formTemplate/hooks";
import { faEdit } from "@fortawesome/pro-regular-svg-icons";
import { Keys } from "@data/formTemplate/constants";
import { FormTemplateResponse } from "@data/formTemplate/queries";
import { useQueryClient } from "react-query";

// component with state has to be outside modal
const ModalContents = () => {
    const modals = useModals();
    const queryClient = useQueryClient();
    const { formTemplateId } = useSnapshot(formTemplateState);
    const data = queryClient.getQueryData<FormTemplateResponse>([
        Keys.GET_FORM_TEMPLATE,
        formTemplateId,
    ]);
    const [name, setName] = useState(data?.formTemplate.name);
    const [loading, setLoading] = useState(false);
    const { mutateAsync } = useUpdateFormTemplate();
    const onConfirm = async () => {
        setLoading(true);
        const fieldDetails = await mutateAsync({
            name,
            formTemplateId,
        });
        fieldDetails ? modals.closeAll() : setLoading(false);
    };
    return (
        <Group grow direction="column">
            <TextInput
                value={name}
                onChange={(event) => setName(event.currentTarget.value)}
            />
            <Group grow>
                <Button
                    variant="light"
                    color="gray"
                    onClick={() => modals.closeAll()}
                    disabled={loading}
                >
                    Cancel
                </Button>
                <Button onClick={() => onConfirm()} loading={loading}>
                    Update
                </Button>
            </Group>
        </Group>
    );
};

export const TitleEdit = () => {
    const modals = useModals();

    const openTitleModal = () =>
        modals.openModal({
            title: "Update form template name",
            id: "formTemplateNameModal",
            closeOnClickOutside: false,
            size: "xl",

            children: <ModalContents />,
        });

    return (
        <ActionIcon onClick={() => openTitleModal()}>
            <FontAwesomeIcon icon={faEdit} />
        </ActionIcon>
    );
};
