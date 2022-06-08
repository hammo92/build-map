import { useCreateFormTemplate } from "@data/formTemplate/hooks";
import React, { FC, useState } from "react";
import { useForm } from "@mantine/form";
import { Box, Button, Group, Modal, TextInput } from "@mantine/core";
import { useRouter } from "next/router";
import { formTemplateState } from "@state/formTemplate";

interface FormTemplateCreateModalProps {
    opened: boolean;
    onClose: () => void;
}

export const FormTemplateCreateModal: FC<FormTemplateCreateModalProps> = ({
    opened,
    onClose,
}) => {
    const { query } = useRouter();
    const [loading, setLoading] = useState(false);
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
                        setLoading(true);
                        const { newFormTemplate } = await mutateAsync({
                            name,
                            organisationId: query.orgId! as string,
                        });
                        //set new formTemplate as active in state
                        formTemplateState.formTemplateId = newFormTemplate.id;
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
                        <Button disabled={loading} type="submit">
                            Submit
                        </Button>
                    </Group>
                </form>
            </Box>
        </Modal>
    );
};
