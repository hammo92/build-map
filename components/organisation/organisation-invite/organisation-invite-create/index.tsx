import { useCreateInvite } from "@data/invitation/hooks";
import { Button, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import React from "react";

export const OrganisationInviteCreate = ({ organisationId }) => {
    const form = useForm({
        initialValues: {
            email: "",
        },
    });
    const { mutateAsync } = useCreateInvite();
    return (
        <>
            <form
                onSubmit={form.onSubmit(async ({ email }) => {
                    await mutateAsync({ email, organisationId });
                })}
            >
                <TextInput
                    required
                    label="Email"
                    {...form.getInputProps("email")}
                />
                <Space h="sm" />
                <Space h="lg" />
                <Button type="submit">Invite</Button>
            </form>
        </>
    );
};
