import { faArrowRight } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import React from "react";
import { useRouter } from "next/router";

export const OrganisationListItem = ({ organisation }) => {
    console.log("organisation", organisation);
    const router = useRouter();
    return (
        <Card
            shadow="sm"
            padding="md"
            sx={{
                cursor: "pointer",
                width: "100%",
            }}
            onClick={() => router.push(`/organisations/${organisation.id}`)}
        >
            <Group position="apart">
                <Group direction="column" spacing="xs">
                    <Text transform="capitalize">{organisation.name}</Text>
                </Group>
                <ActionIcon>
                    <FontAwesomeIcon icon={faArrowRight} />
                </ActionIcon>
            </Group>
        </Card>
    );
};
