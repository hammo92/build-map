import { Keys } from "../constants";
import { useMutation, useQuery } from "react-query";
import { useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import {
    createOrganisation,
    getMyOrganisations,
    getOrganisationUsers,
} from "../queries";

export function useCreateOrganisation() {
    const notifications = useNotifications();
    return useMutation(createOrganisation, {
        mutationKey: Keys.CREATE_ORGANISATION,
        onSuccess: ({ organisation }) => {
            notifications.showNotification({
                title: `${organisation.name} created`,
                message: `Successfully setup organisation`,
                color: "green",
            });
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            notifications.showNotification({
                title: "Error",
                message: error?.response?.data.message,
                color: "red",
            });
        },
    });
}

export function useGetMyOrganisations() {
    return useQuery(Keys.GET_MY_ORGANISATIONS, getMyOrganisations);
}

export function useGetOrganisationUsers({
    organisationId,
}: {
    organisationId: string;
}) {
    return useQuery([Keys.GET_ORGANISATION_USERS, organisationId], () =>
        getOrganisationUsers({ organisationId })
    );
}
