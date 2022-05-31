import { proxy } from "valtio";

export const organisationState = proxy({
    activeOrganisation: undefined,
});
