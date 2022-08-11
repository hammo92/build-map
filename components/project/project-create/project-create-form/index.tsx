import { useCreateProject } from "@data/projects/hooks";
import { Button, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import React, { FC } from "react";

interface ProjectCreateProps {
    organisationId: string;
    onCreate: () => void;
}

export const ProjectCreateForm: FC<ProjectCreateProps> = ({ organisationId, onCreate }) => {
    const { mutateAsync, isLoading } = useCreateProject();
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
                project && onCreate();
            })}
        >
            <TextInput required label="Project Name" {...form.getInputProps("name")} />
            <Space h="sm" />
            <Button type="submit" loading={isLoading} disabled={isLoading} fullWidth>
                Create
            </Button>
        </form>
    );
};
