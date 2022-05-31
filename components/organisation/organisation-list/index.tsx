import React from "react";
import { Group, Text, Loader, Card, Skeleton } from "@mantine/core";
import { useGetMyOrganisations } from "@data/organisation/hooks";
import { OrganisationListItem } from "./organisation-list-item";
import { StripModel } from "type-helpers";
import { Organisation } from "@lib/organisation/data/organisation.model";

export const OrganisationList = () => {
    const { data, isLoading, error } = useGetMyOrganisations();
    if (error) {
        console.log(error);
    }

    return (
        <Group direction="column" grow>
            {isLoading ? (
                <Skeleton height={60} mt={6} radius="sm" />
            ) : data?.organisations.length ? (
                data?.organisations.map(
                    (organisation: StripModel<Organisation>) => (
                        <OrganisationListItem
                            organisation={organisation}
                            key={organisation.id}
                        />
                    )
                )
            ) : (
                <Text>No Organisations Found</Text>
            )}
        </Group>
    );
};
