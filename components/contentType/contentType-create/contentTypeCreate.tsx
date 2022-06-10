import { IconPicker } from "@components/ui/iconPicker";
import { useCreateContentType } from "@data/contentType/hooks";
import { IconDefinition } from "@fortawesome/pro-regular-svg-icons";
import { ContentTypeIcon } from "@lib/contentType/data/contentType.model";
import { Box, Button, Group, Text, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import { contentTypeState } from "@state/contentType";
import { useRouter } from "next/router";
import React, { useState } from "react";

const ContentTypeCreateForm = () => {
    const { query } = useRouter();
    const modals = useModals();
    const [icon, setIcon] = useState<ContentTypeIcon>();
    const [loading, setLoading] = useState(false);
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync } = useCreateContentType();
    return (
        <Box>
            <form
                onSubmit={form.onSubmit(async ({ name }) => {
                    setLoading(true);
                    if (icon) {
                        const { newContentType } = await mutateAsync({
                            name,
                            organisationId: query.orgId! as string,
                            icon,
                        });
                        if (newContentType) {
                            //set new contentType as active in state
                            contentTypeState.contentTypeId = newContentType.id;
                            modals.closeModal("contentTypeCreateModal");
                        }
                        setLoading(false);
                    }

                    setLoading(false);
                })}
            >
                <Group direction="column" grow>
                    <TextInput
                        required
                        label="Content Type Name"
                        placeholder="eg. Scaffolding Doc"
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
                        disabled={loading}
                        onClick={() =>
                            modals.closeModal("contentTypeCreateModal")
                        }
                        color="gray"
                    >
                        Cancel
                    </Button>
                    <Button disabled={loading} type="submit">
                        Submit
                    </Button>
                </Group>
            </form>
        </Box>
    );
};

export const ContentTypeCreate = () => {
    const modals = useModals();

    const openCreateModal = () =>
        modals.openModal({
            title: `Create New Content Type`,
            id: "contentTypeCreateModal",
            closeOnClickOutside: false,
            size: "xl",
            children: <ContentTypeCreateForm />,
        });
    return <Button onClick={() => openCreateModal()}>Add Content Type</Button>;
};
