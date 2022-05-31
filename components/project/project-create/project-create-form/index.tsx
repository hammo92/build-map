import { useCreateProject } from "@data/projects/hooks";
import { Button, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import React, { FC } from "react";

interface ProjectCreateProps {
    organisationId: string;
    onSuccess: () => null;
}

export const ProjectCreateForm: FC<ProjectCreateProps> = ({
    organisationId,
    onSuccess,
}) => {
    const { mutateAsync } = useCreateProject();
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    return (
        <form
            onSubmit={form.onSubmit(async ({ name }) => {
                const { project } = await mutateAsync({
                    name,
                    organisationId,
                });
                project && onSuccess();
            })}
        >
            <TextInput
                required
                label="Project Name"
                {...form.getInputProps("name")}
            />
            <Space h="sm" />
            <Button type="submit">Create</Button>
        </form>
    );
};
