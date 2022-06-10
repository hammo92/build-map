import { ContentTypeField } from "@lib/contentType/data/contentType.model";
import { proxy } from "valtio";

export const contentTypeState = proxy<{
    hasEditPermission: boolean;
    contentTypeId: string;
    fieldDetails: Partial<ContentTypeField>;
    updateFieldDetails: (newDetails: Partial<ContentTypeField>) => void;
    updateFieldConfig: (newConfig: Partial<ContentTypeField["config"]>) => void;
}>({
    hasEditPermission: true,
    contentTypeId: "",
    fieldDetails: {},
    updateFieldDetails: (newDetails) => {
        contentTypeState.fieldDetails = {
            ...contentTypeState.fieldDetails,
            ...newDetails,
        };
    },
    updateFieldConfig: (newConfig) => {
        contentTypeState.updateFieldDetails({
            config: { ...contentTypeState.fieldDetails.config, ...newConfig },
        });
    },
});
