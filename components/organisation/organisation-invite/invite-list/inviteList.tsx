import { useGetMyInvites } from "@data/invitation/hooks";
import { Stack, Text } from "@mantine/core";
import { ListItem } from "./list-item";
import { ListSkeleton } from "./list-skeleton";

export const InviteList = () => {
    const { data, isLoading } = useGetMyInvites();
    if (data) {
        const pendingInvitations = data.invitations.filter((invitation) => !invitation.redeemed);
        if (pendingInvitations.length) {
            return (
                <Stack>
                    {pendingInvitations.map((invitation) => (
                        <ListItem
                            key={invitation.id}
                            invitation={invitation}
                            organisationId={invitation.organisationId}
                        />
                    ))}
                </Stack>
            );
        }
        return <Text>No Pending Invitations Found</Text>;
    }

    if (isLoading) return <ListSkeleton />;

    return <Text>No Invitations Found</Text>;
};
