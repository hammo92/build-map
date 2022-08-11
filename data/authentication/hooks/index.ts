import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";
import { setCookies } from "cookies-next";
import { useMutation } from "react-query";
import { Keys } from "../constants";
import { login, register } from "../queries";

export function useLogin() {
    return useMutation(login, {
        mutationKey: Keys.USER_LOGIN,
        onSuccess: (res) => {
            const { user, token } = res;
            setCookies("token", token, {
                sameSite: true,
                expires: new Date(new Date().getTime() + 1000 * 360000),
            });
            showNotification({
                title: "Logged In",
                message: `Welcome back ${user.nickname}`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
                title: "Error",
                message: error?.response?.data?.message,
                color: "red",
            });
        },
    });
}

export function useRegister() {
    return useMutation(register, {
        mutationKey: Keys.USER_REGISTER,
        onSuccess: (res) => {
            const { token, user } = res;
            setCookies("token", token, {
                sameSite: true,
                expires: new Date(new Date().getTime() + 1000 * 360000),
            });
            showNotification({
                title: "Registered Sucessfully",
                message: `Welcome ${user.nickname}`,
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
                title: "Error",
                message: error?.response?.data?.message,
                color: "red",
            });
        },
    });
}
