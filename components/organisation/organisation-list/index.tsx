import { useGetMyOrganisations } from "@data/organisation/hooks";
import { Organisation } from "@lib/organisation/data/organisation.model";
import { Skeleton, Stack, Text } from "@mantine/core";
import { StripModel } from "type-helpers";
import { OrganisationListItem } from "./organisation-list-item";

export const OrganisationList = () => {
    const { data, isLoading, error } = useGetMyOrganisations();
    if (error) {
        console.log(error);
    }

    return (
        <Stack>
            {isLoading ? (
                <Skeleton height={60} mt={6} radius="sm" />
            ) : data?.organisations.length ? (
                data?.organisations.map((organisation: StripModel<Organisation>) => (
                    <OrganisationListItem organisation={organisation} key={organisation.id} />
                ))
            ) : (
                <Text>No Organisations Found</Text>
            )}
        </Stack>
    );
};
