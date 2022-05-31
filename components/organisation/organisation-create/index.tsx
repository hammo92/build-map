import { Button, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { organisationState } from "@state";
import { useCreateOrganisation } from "@data/organisation/hooks";
import { useRouter } from "next/router";
import React from "react";
export const CreateOrganisation = () => {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            name: "",
        },
    });
    const { mutateAsync } = useCreateOrganisation();
    return (
        <form
            onSubmit={form.onSubmit(async ({ name }) => {
                await mutateAsync({
                    name,
                });
                //router.push("/");
            })}
        >
            <TextInput
                required
                label="Organisation Name"
                {...form.getInputProps("name")}
            />
            <Space h="sm" />
            <Button type="submit" fullWidth>
                Create
            </Button>
        </form>
    );
};
