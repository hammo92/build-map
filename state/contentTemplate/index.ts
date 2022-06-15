import { ContentTemplateField } from "@lib/contentTemplate/data/contentTemplate.model";
import { proxy } from "valtio";

export const contentTemplateState = proxy<{
    hasEditPermission: boolean;
    contentTemplateId: string;
    fieldDetails: Partial<ContentTemplateField>;
    updateFieldDetails: (newDetails: Partial<ContentTemplateField>) => void;
    updateFieldConfig: (
        newConfig: Partial<ContentTemplateField["config"]>
    ) => void;
}>({
    hasEditPermission: true,
    contentTemplateId: "",
    fieldDetails: {},
    updateFieldDetails: (newDetails) => {
        contentTemplateState.fieldDetails = {
            ...contentTemplateState.fieldDetails,
            ...newDetails,
        };
    },
    updateFieldConfig: (newConfig) => {
        contentTemplateState.updateFieldDetails({
            config: {
                ...contentTemplateState.fieldDetails.config,
                ...newConfig,
            },
        });
    },
});
