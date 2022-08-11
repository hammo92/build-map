import { authState } from "@state/auth";
import { proxy } from "valtio";
import { CLOUD_API_URL } from "../config";

export const conversationState = proxy({
    organisations: undefined,
    activeOrganisation: undefined,
    error: undefined,
    systemWarning: undefined,

    create: async ({ name }) => {
        const token = await authState.getToken();
        const response = await fetch(`${CLOUD_API_URL}/organisation/create`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ name }),
        });
        const { organisation, message, systemWarning } = await response.json();
        organisationState.error = message;
        organisationState.systemWarning = systemWarning;
    },
});
