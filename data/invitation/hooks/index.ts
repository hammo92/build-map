import { Keys } from "../constants";
import { useMutation, useQuery } from "react-query";
import { createInvite, getInvitesForEmail, getMyInvites, joinFromInvite } from "../queries";
import { showNotification } from "@mantine/notifications";
import { AxiosError } from "axios";

export function useCreateInvite() {
    return useMutation(createInvite, {
        mutationKey: Keys.CREATE_INVITE,
        onSuccess: (res) => {
            showNotification({
                title: "Invitation created",
                message: `Successfully sent invitation`,
                color: "green",
            });
        },
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}

export function useGetInvitesByEmail({ email }) {
    return useQuery([Keys.GET_INVITES_FOR_EMAIL, email], () => getInvitesForEmail(email), {
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}

export function useGetMyInvites() {
    return useQuery(Keys.GET_MY_INVITES, () => getMyInvites(), {
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}

export function useJoinFromInvite() {
    return useMutation(joinFromInvite, {
        mutationKey: Keys.JOIN_FROM_INVITE,
        onSuccess: (res) => {
            console.log(`res`, res);
            showNotification({
                title: "Invitation accepted",
                message: `Successfully joined organisation`,
                color: "green",
            });
        },
        onError: (error: AxiosError) => {
            console.log(`error`, error?.response.data);
            showNotification({
                title: "Error",
                message: error?.response.data.message,
                color: "red",
            });
        },
    });
}
