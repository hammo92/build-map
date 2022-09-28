import { Property } from "@lib/contentTemplate/data/types";
import { proxy } from "valtio";

export interface ContentTemplateStateProps {
    hasEditPermission: boolean;
    contentTemplateId: string;
    deletingGroup: string | number;
    processingItems: (string | number)[];
    editing: boolean;
}

export const contentTemplateState = proxy<ContentTemplateStateProps>({
    hasEditPermission: true,
    contentTemplateId: "",
    deletingGroup: "",
    processingItems: [],
    editing: false,
});
