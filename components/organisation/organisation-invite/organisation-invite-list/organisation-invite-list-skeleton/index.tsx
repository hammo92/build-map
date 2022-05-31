import { Skeleton, Group } from "@mantine/core";

export const OrganisationInviteListSkeleton = () => {
    return (
        <Group direction="column" grow>
            <Skeleton height={90} />
            <Skeleton height={90} />
        </Group>
    );
};
