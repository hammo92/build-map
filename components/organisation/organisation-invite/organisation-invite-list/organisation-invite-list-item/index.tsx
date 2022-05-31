import { useJoinFromInvite } from "@data/invitation/hooks";
import {
    faArrowRight,
    faCheck,
    faTimes,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, LoadingOverlay, Text } from "@mantine/core";
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
                onClick={() =>
                    !invitationRedeemed && joinOrg(invitation.invitationId)
                }
                shadow="sm"
                padding="md"
                sx={(theme) => ({
                    cursor: !invitationRedeemed ? "pointer" : "auto",
                    width: "100%",
                })}
            >
                <Group position="apart">
                    <Group direction="column" spacing="xs">
                        <Text transform="capitalize">{org.name}</Text>
                        <Text
                            size="sm"
                            color={invitationRedeemed ? "teal" : "orange"}
                        >
                            {invitationRedeemed ? "Joined" : "Pending"}
                        </Text>
                    </Group>
                    <ActionIcon disabled={invitationRedeemed}>
                        <FontAwesomeIcon
                            icon={
                                invitationRedeemed
                                    ? faCheck
                                    : isError
                                    ? faTimes
                                    : faArrowRight
                            }
                        />
                    </ActionIcon>
                </Group>
            </Card>
        </>
    );
};
