import { proxy } from "valtio";

export const organisationState = proxy<{
    activeOrganisation: string;
}>({
    activeOrganisation: "",
});
