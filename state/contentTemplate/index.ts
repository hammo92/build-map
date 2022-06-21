import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { proxy } from "valtio";


export interface ContentTemplateStateProps {
    hasEditPermission: boolean;
    contentTemplateId: string;
    fieldProperties: ContentTemplateField;
    updateFieldProperties: (newDetails: Partial<ContentTemplateField>) => void;
}

export const contentTemplateState = proxy<ContentTemplateStateProps>({
    hasEditPermission: true,
    contentTemplateId: "",
    fieldProperties: { type: "text", name: "" },
    updateFieldProperties: (newDetails) => {
        contentTemplateState.fieldProperties = {
            ...contentTemplateState.fieldProperties,
            ...newDetails,
        };
    },
});
