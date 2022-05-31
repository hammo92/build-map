import { useCreateFormTemplate } from "@data/formTemplate/hooks";
import React, { FC } from "react";
import { useForm } from "@mantine/form";
import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useRouter } from "next/router";

interface FormTemplateCreateModalProps {
    opened: boolean;
    onClose: () => void;
}

export const FormTemplateCreateModal: FC<FormTemplateCreateModalProps> = ({
    opened,
    onClose,
}) => {
    const { query } = useRouter();
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync } = useCreateFormTemplate();
    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Create New Form Template"
        >
            <Box>
                <form
                    onSubmit={form.onSubmit(async ({ name }) => {
                        await mutateAsync({
                            name,
                            organisationId: query.orgId! as string,
                        });
                        onClose();
                    })}
                >
                    <TextInput
                        required
                        label="Form Template Name"
                        placeholder="eg. Scaffolding Doc"
                        {...form.getInputProps("name")}
                    />

                    <Group position="right" mt="md">
                        <Button type="submit">Submit</Button>
                    </Group>
                </form>
            </Box>
        </Modal>
    );
};
