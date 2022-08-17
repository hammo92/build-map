import { Keys } from "../constants";
import { useMutation, useQueries, useQuery, useQueryClient } from "react-query";
import { getMe, getUser, updateMe } from "../queries";
import { AxiosError } from "axios";
import { CleanedCamel } from "type-helpers";
import { User } from "@lib/user/data/user.model";
import { showNotification } from "@mantine/notifications";
import { StrippedUser } from "@lib/user/data";

export function useGetMe() {
    return useQuery([Keys.GET_ME], () => getMe());
}

export function useGetUser({ userIdentifier }: { userIdentifier: string }) {
    return useQuery([Keys.GET_USER, userIdentifier], () => getUser({ userIdentifier }));
}

export function useGetUsers({ userIdentifiers }: { userIdentifiers: string[] }) {
    const queries = userIdentifiers.map((userIdentifier) => {
        return {
            queryKey: [Keys.GET_USER, userIdentifier],
            queryFn: () => getUser({ userIdentifier }),
        };
    });
    return useQueries(queries);
}

export function useUpdateMe() {
    const queryClient = useQueryClient();
    return useMutation(updateMe, {
        onMutate: async (userDetails) => {
            const queryId = Keys.UPDATE_ME;
            // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
            await queryClient.cancelQueries(queryId);
            // Snapshot the previous value
            const currentData = queryClient.getQueryData<{
                user: CleanedCamel<User>;
            }>(queryId);

            if (currentData?.user) {
                // Optimistically update to the new value
                queryClient.setQueryData(queryId, () => {
                    return {
                        ...currentData,
                        ...userDetails,
                    };
                });
            }
        },
        onSettled: (data) => {
            queryClient.invalidateQueries(Keys.UPDATE_ME);
            showNotification({
                title: `User Updated`,
                message: `User Updated successfully`,
                color: "green",
            });
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
