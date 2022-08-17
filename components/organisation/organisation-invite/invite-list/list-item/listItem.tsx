import { useJoinFromInvite } from "@data/invitation/hooks";
import { faArrowRight, faCheck, faTimes } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Invitation } from "@lib/invitation/data/invitation.model";
import { Organisation } from "@lib/organisation/data/organisation.model";
import { ActionIcon, Card, Group, LoadingOverlay, Stack, Text } from "@mantine/core";
import React from "react";
import { CleanedCamel } from "type-helpers";

export const ListItem = ({
    invitation,
    organisationId,
}: {
    invitation: CleanedCamel<Invitation>;
    organisationId: string;
}) => {
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
                onClick={() => !invitationRedeemed && joinOrg(invitation.id)}
                shadow="sm"
                sx={(theme) => ({
                    cursor: !invitationRedeemed ? "pointer" : "auto",
                    width: "100%",
                })}
            >
                <Group position="apart">
                    <Stack spacing="xs">
                        {
                            //Todo: get org name
                        }
                        <Text transform="capitalize">{organisationId}</Text>
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
