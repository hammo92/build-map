import { apiClient } from "data/config";

export async function createInvite({ email, organisationId }) {
    const { data } = await apiClient.post(`/invitation/create`, {
        email,
        organisationId,
    });
    return data;
}

export async function getInvitesForEmail({ email }) {
    const { data } = await apiClient.get(`/invitation/user/${email}`);
    return data;
}

export async function getMyInvites() {
    const { data } = await apiClient.get(`me/invitations`);
    return data;
}

export async function joinFromInvite({ invitationId }) {
    console.log(`invitationId`, invitationId);
    const { data } = await apiClient.post(`/invitation/accept`, {
        invitationId,
    });
    return data;
}
