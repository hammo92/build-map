import { Keys } from "../constants";
import { useMutation, useQuery } from "react-query";
import {
    createInvite,
    getInvitesForEmail,
    getMyInvites,
    joinFromInvite,
} from "../queries";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";

export function useCreateInvite() {
    const notifications = useNotifications();
    return useMutation(createInvite, {
        mutationKey: Keys.CREATE_INVITE,
        onSuccess: (res) => {
            notifications.showNotification({
                title: "Invitation created",
                message: `Successfully sent invitation`,
                color: "green",
            });
        },
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}

export function useGetInvitesByEmail({ email }) {
    const notifications = useNotifications();
    return useQuery(
        [Keys.GET_INVITES_FOR_EMAIL, email],
        () => getInvitesForEmail(email),
        {
            onError: (error: AxiosError) => {
                console.log(`error`, error?.response.data);
                notifications.showNotification({
                    title: "Error",
                    message: error?.response.data.message,
                    color: "red",
                });
            },
        },
    );
}

export function useGetMyInvites() {
    const notifications = useNotifications();
    return useQuery(Keys.GET_MY_INVITES, () => getMyInvites(), {
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}

export function useJoinFromInvite() {
    const notifications = useNotifications();
    return useMutation(joinFromInvite, {
        mutationKey: Keys.JOIN_FROM_INVITE,
        onSuccess: (res) => {
            console.log(`res`, res);
            notifications.showNotification({
                title: "Invitation accepted",
                message: `Successfully joined organisation`,
                color: "green",
            });
        },
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}
