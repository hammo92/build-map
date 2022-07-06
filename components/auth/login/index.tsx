import { useLogin } from "@data/authentication/hooks";
import { Button, PasswordInput, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useRouter } from "next/router";
import React from "react";

export const Login = () => {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            email: "",
            password: "",
        },
        validationRules: {
            email: (value) => /^\S+@\S+$/.test(value),
            password: (value) => value.length > 6,
        },
        errorMessages: {
            email: "Please enter a valid email",
            password: "Your password must be 8 characters or longer",
        },
    });
    const { mutateAsync, error, isSuccess } = useLogin();
    return (
        <form
            onSubmit={form.onSubmit(async ({ email, password }) => {
                await mutateAsync({
                    email,
                    password,
                });
                router.push("/");
            })}
        >
            <TextInput required label="Email" {...form.getInputProps("email")} />
            <Space h="sm" />
            <PasswordInput
                placeholder="Password"
                label="Password"
                description="Password must include at least one letter, number and special character"
                required
                {...form.getInputProps("password")}
            />
            <Space h="lg" />
            <Button type="submit">Login</Button>
        </form>
    );
};
