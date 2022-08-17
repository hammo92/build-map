import { faArrowRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";
import { Organisation } from "@lib/organisation/data/organisation.model";
import { CleanedCamel } from "type-helpers";

export const OrganisationListItem = ({
    organisation,
}: {
    organisation: CleanedCamel<Organisation>;
}) => {
    const router = useRouter();
    return (
        <Card
            shadow="sm"
            sx={{
                cursor: "pointer",
                width: "100%",
            }}
            onClick={() => router.push(`/organisations/${organisation.id}`)}
        >
            <Group position="apart">
                <Stack spacing="xs">
                    <Text transform="capitalize">{organisation.name}</Text>
                </Stack>
                <ActionIcon onClick={() => router.push(`/organisations/${organisation.id}`)}>
                    <FontAwesomeIcon icon={faArrowRight} />
                </ActionIcon>
            </Group>
        </Card>
    );
};
