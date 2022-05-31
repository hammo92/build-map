import { useRegister } from "@data/authentication/hooks";
import { Button, PasswordInput, Space, TextInput } from "@mantine/core";
import { useForm } from "@mantine/hooks";
import { useRouter } from "next/router";
import React from "react";
export const Register = () => {
    const router = useRouter();
    const form = useForm({
        initialValues: {
            name: "",
            password: "",
            email: "",
        },
        validationRules: {
            name: (value) => value.length > 2,
            email: (value) => /^\S+@\S+$/.test(value),
            password: (value) => value.length > 6,
        },
        errorMessages: {
            name: "provided name is too short",
            email: "Please enter a valid email",
            password: "Your password must be 6 characters or longer",
        },
    });
    const { mutateAsync } = useRegister();
    return (
        <form
            onSubmit={form.onSubmit(async ({ email, name, password }) => {
                await mutateAsync({
                    email,
                    name,
                    password,
                });
                router.push("/");
            })}
        >
            <TextInput
                required
                label="Full Name"
                {...form.getInputProps("name")}
            />
            <Space h="sm" />
            <TextInput
                required
                label="Email"
                {...form.getInputProps("email")}
            />
            <Space h="sm" />
            <PasswordInput
                placeholder="Password"
                label="Password"
                description="Password must include at least one letter, number and special character"
                required
                {...form.getInputProps("password")}
            />
            <Space h="lg" />
            <Button type="submit">Register</Button>
        </form>
    );
};
