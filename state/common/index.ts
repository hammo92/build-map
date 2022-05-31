import { proxy } from "valtio";

export const commonState = proxy({
    previousPage: {
        url: "/",
        text: "Home",
    },
});
