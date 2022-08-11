import { SmartForm } from "@components/smartForm";
import { useLogin } from "@data/authentication/hooks";
import { Button, PasswordInput, Space, Stack, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import { useRouter } from "next/router";
import React from "react";

export const Login = () => {
    const router = useRouter();
    const { mutateAsync, error, isSuccess } = useLogin();
    return (
        <SmartForm
            formName="Login"
            onSubmit={async (values: any) => {
                await mutateAsync(values);
                router.push("/");
            }}
        >
            <Stack spacing="sm">
                <SmartForm.TextInput required label="Email" name="email" />
                <SmartForm.PasswordInput
                    name="password"
                    placeholder="Password"
                    label="Password"
                    description="Password must include at least one letter, number and special character"
                    required
                />
                <Button type="submit">Login</Button>
            </Stack>
        </SmartForm>
    );
};
