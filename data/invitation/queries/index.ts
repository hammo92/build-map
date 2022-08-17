import { Invitation } from "@lib/invitation/data/invitation.model";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedSnake } from "type-helpers";

export async function createInvite({
    email,
    organisationId,
}: {
    email: string;
    organisationId: string;
}) {
    const { data } = await apiClient.post<{ invitation: CleanedSnake<Invitation> }>(
        `/invitations`,
        {
            email,
            organisationId,
        }
    );
    return camelcaseKeys(data, { deep: true });
}

export async function getInvitesForEmail({ email }: { email: string }) {
    const { data } = await apiClient.get<{ invitations: CleanedSnake<Invitation>[] }>(
        `/invitation/user/${email}`
    );
    return data;
}

export async function getMyInvites() {
    const { data } = await apiClient.get<{ invitations: CleanedSnake<Invitation>[] }>(
        `/me/invitations`
    );
    return camelcaseKeys(data, { deep: true });
}

export async function joinFromInvite({ invitationId }: { invitationId: string }) {
    const { data } = await apiClient.post<{ invitation: CleanedSnake<Invitation> }>(
        `/invitations/${invitationId}/redeem`
    );
    return camelcaseKeys(data, { deep: true });
}
