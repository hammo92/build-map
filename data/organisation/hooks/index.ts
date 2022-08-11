import { Keys } from "../constants";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { showNotification, useNotifications } from "@mantine/notifications";
import { AxiosError } from "axios";
import { createOrganisation, getMyOrganisations, getOrganisationUsers } from "../queries";
import { CleanedCamel } from "type-helpers";
import { Organisation } from "@lib/organisation/data/organisation.model";

export type MyOrganisationsResponse = {
    organisations: CleanedCamel<Organisation>;
};

export function useCreateOrganisation() {
    const queryClient = useQueryClient();
    return useMutation(createOrganisation, {
        mutationKey: Keys.CREATE_ORGANISATION,
        onMutate: async ({ name }) => {
            const queryId = Keys.GET_MY_ORGANISATIONS;
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);

            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                organisations: CleanedCamel<Organisation>[];
            }>(queryId);

            if (currentData?.organisations) {
                const { organisations } = currentData;

                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => ({
                    organisations: [...organisations, { name }],
                }));
            }
        },

        onSettled: (data) => {
            queryClient.invalidateQueries(Keys.GET_MY_ORGANISATIONS);
        },
        onError: (error: AxiosError<{ message: string }>) => {
            console.log(`error`, error?.response?.data);
            showNotification({
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

export function useGetOrganisationUsers({ organisationId }: { organisationId: string }) {
    return useQuery([Keys.GET_ORGANISATION_USERS, organisationId], () =>
        getOrganisationUsers({ organisationId })
    );
}
