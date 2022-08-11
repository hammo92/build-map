import { useGetMyInvites } from "@data/invitation/hooks";
import { Group, Stack, Text } from "@mantine/core";
import React from "react";
import { OrganisationInviteListItem } from "./organisation-invite-list-item";
import { OrganisationInviteListSkeleton } from "./organisation-invite-list-skeleton";

export const OrganisationInviteList = () => {
    const { data, isLoading } = useGetMyInvites();
    if (data) {
        const pendingInvitations = data.invitations.filter(
            (invitation) => !invitation.invitation.redeemed
        );
        if (pendingInvitations.length) {
            return (
                <Stack>
                    {pendingInvitations.map(({ invitation, org }) => (
                        <OrganisationInviteListItem
                            key={invitation.id}
                            invitation={invitation}
                            org={org}
                        />
                    ))}
                </Stack>
            );
        }
        return <Text>No Pending Invitations Found</Text>;
    }

    if (isLoading) return <OrganisationInviteListSkeleton />;

    return <Text>No Invitations Found</Text>;
};
