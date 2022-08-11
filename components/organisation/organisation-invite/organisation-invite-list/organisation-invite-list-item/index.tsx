import { useJoinFromInvite } from "@data/invitation/hooks";
import { faArrowRight, faCheck, faTimes } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import React from "react";

export const OrganisationInviteListItem = ({ invitation, org }) => {
    const { mutateAsync, isLoading, isSuccess, isError } = useJoinFromInvite();
    const invitationRedeemed = isSuccess || invitation.redeemed;
    const joinOrg = async (invitationId: string) => {
        await mutateAsync({
            invitationId,
        });
    };
    return (
        <>
            <LoadingOverlay visible={isLoading} />
            <Card
                onClick={() => !invitationRedeemed && joinOrg(invitation.invitationId)}
                shadow="sm"
                padding="md"
                sx={(theme) => ({
                    cursor: !invitationRedeemed ? "pointer" : "auto",
                    width: "100%",
                })}
            >
                <Group position="apart">
                    <Stack spacing="xs">
                        <Text transform="capitalize">{org.name}</Text>
                        <Text size="sm" color={invitationRedeemed ? "blue" : "orange"}>
                            {invitationRedeemed ? "Joined" : "Pending"}
                        </Text>
                    </Stack>
                    <ActionIcon disabled={invitationRedeemed}>
                        <FontAwesomeIcon
                            icon={invitationRedeemed ? faCheck : isError ? faTimes : faArrowRight}
                        />
                    </ActionIcon>
                </Group>
            </Card>
        </>
    );
};
