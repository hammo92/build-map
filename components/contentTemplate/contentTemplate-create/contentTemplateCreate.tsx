import { IconPicker } from "@components/ui/iconPicker";
import { useCreateContentTemplate } from "@data/contentTemplate/hooks";
import { faPlus, IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ContentTemplate,
    ContentTemplateIcon,
} from "@lib/contentTemplate/data/contentTemplate.model";
import { ActionIcon, Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { contentTemplateState } from "@state/contentTemplate";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";

const ContentTemplateCreateForm: FC<{ type: ContentTemplate["type"] }> = ({
    type,
}) => {
    const { query } = useRouter();
    const modals = useModals();
    const [icon, setIcon] = useState<ContentTemplateIcon>();
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync, isLoading } = useCreateContentTemplate();
    return (
        <Box>
            <form
                onSubmit={form.onSubmit(async ({ name }) => {
                    if (icon) {
                        const { newContentTemplate } = await mutateAsync({
                            name,
                            organisationId: query.orgId! as string,
                            icon,
                            type,
                        });
                        if (newContentTemplate) {
                            //set new contentTemplate as active in state
                            contentTemplateState.contentTemplateId =
                                newContentTemplate.id;
                            modals.closeModal("contentTemplateCreateModal");
                        }
                    }
                })}
            >
                <Group direction="column" grow>
                    <TextInput
                        required
                        label={`${
                            type === "collection" ? "Template" : "Component"
                        } Name`}
                        placeholder={`eg. ${
                            type === "collection"
                                ? "Scaffolding Doc"
                                : "Address"
                        }`}
                        {...form.getInputProps("name")}
                    />
                    <Group direction="column" grow spacing="xs">
                        <Text size="sm">Select an Icon</Text>
                        <Box
                            p="md"
                            sx={(theme) => ({
                                background: theme.colors.dark[6],
                                borderRadius: theme.radius.sm,
                            })}
                        >
                            <IconPicker
                                onChange={({ icon, color }) =>
                                    setIcon({ icon, color })
                                }
                            />
                        </Box>
                    </Group>
                </Group>

                <Group position="right" mt="md" grow>
                    <Button
                        disabled={isLoading}
                        onClick={() =>
                            modals.closeModal("contentTemplateCreateModal")
                        }
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button
                        disabled={isLoading}
                        loading={isLoading}
                        type="submit"
                    >
                        Submit
                    </Button>
                </Group>
            </form>
        </Box>
    );
};

export const ContentTemplateCreate: FC<{ type: ContentTemplate["type"] }> = ({
    type,
}) => {
    const modals = useModals();

    const openCreateModal = () =>
        modals.openModal({
            title: `Create New ${
                type === "collection" ? "Template" : "Component"
            }`,
            id: "contentTemplateCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: <ContentTemplateCreateForm type={type} />,
        });
    return (
        <ActionIcon
            onClick={() => openCreateModal()}
            variant={"filled"}
            color="blue"
        >
            <FontAwesomeIcon icon={faPlus} />
        </ActionIcon>
    );
};
