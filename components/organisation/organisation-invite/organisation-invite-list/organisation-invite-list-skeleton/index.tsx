import { Skeleton, Stack } from "@mantine/core";

export const OrganisationInviteListSkeleton = () => {
    return (
        <Stack>
            <Skeleton height={90} />
            <Skeleton height={90} />
        </Stack>
    );
};
