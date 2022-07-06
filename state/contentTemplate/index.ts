import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { proxy } from "valtio";


export interface ContentTemplateStateProps {
    hasEditPermission: boolean;
    contentTemplateId: string;
}

export const contentTemplateState = proxy<ContentTemplateStateProps>({
    hasEditPermission: true,
    contentTemplateId: "",
});
