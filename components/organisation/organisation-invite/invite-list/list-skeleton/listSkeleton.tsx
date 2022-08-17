import { Skeleton, Stack } from "@mantine/core";

export const ListSkeleton = () => {
    return (
        <Stack>
            <Skeleton height={90} />
            <Skeleton height={90} />
        </Stack>
    );
};
