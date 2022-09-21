import { SmartForm } from "@components/smartForm";
import { useGetMe, useUpdateMe } from "@data/user/hooks";
import { User } from "@lib/user/data/user.model";
import { Button, Stack } from "@mantine/core";
import { MIME_TYPES } from "@mantine/dropzone";
import React from "react";
import { CleanedCamel } from "type-helpers";

export const UserSettings = () => {
    const { data, error, isLoading } = useGetMe();
    const { mutateAsync } = useUpdateMe();
    return (
        <SmartForm
            onSubmit={(values: CleanedCamel<User>) => {
                mutateAsync({
                    userDetails: {
                        ...values,
                        // image upload returns array, get first item
                        ...(values.picture && { picture: values.picture[0] }),
                    },
                });
            }}
            formName="userSettings"
            defaultValues={data?.user}
        >
            <Stack spacing="sm">
                <SmartForm.TextInput name="name" label="Full name" />
                <SmartForm.Assets
                    name="picture"
                    label="Photo"
                    accept={[MIME_TYPES.jpeg, MIME_TYPES.png]}
                    path="public"
                />
                <Button type="submit">Update</Button>
            </Stack>
        </SmartForm>
    );
};
