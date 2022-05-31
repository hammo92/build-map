import { apiClient } from "data/config";

export async function createOrganisation({ name }: { name: string }) {
    const { data } = await apiClient.post(`/organisations`, {
        name,
    });
    return data;
}

export async function getMyOrganisations() {
    const { data } = await apiClient.get(`me/organisations`);
    console.log("data", data);
    return data;
}

export async function getOrganisationUsers({
    organisationId,
}: {
    organisationId: string;
}) {
    const { data } = await apiClient.get(
        `/organisations/${organisationId}/users`
    );
    return data;
}
