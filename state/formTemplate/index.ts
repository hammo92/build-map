import {
    FormTemplate,
    FormTemplateField,
} from "@lib/formTemplate/data/formTemplate.model";
import { CleanedCamel, ModelRequired, StripModel } from "type-helpers";
import { proxy, useSnapshot } from "valtio";
import { Required } from "utility-types";
import { reorderArray } from "utils/arrayModify";

export const formTemplateState = proxy<{
    formTemplate: Required<Partial<CleanedCamel<FormTemplate>>, "id" | "name">;
    hasEditPermission: boolean;
    formTemplateId: string;
    activeFormTemplateFieldId: string;
    fieldDetails: Partial<FormTemplateField>;
    updateFieldDetails: (newDetails: Partial<FormTemplateField>) => void;
    updateFieldConfig: (
        newConfig: Partial<FormTemplateField["config"]>
    ) => void;
}>({
    formTemplate: { id: "", name: "" },
    hasEditPermission: true,
    formTemplateId: "",
    fieldDetails: {},
    activeFormTemplateFieldId: "",
    updateFieldDetails: (newDetails) => {
        formTemplateState.fieldDetails = {
            ...formTemplateState.fieldDetails,
            ...newDetails,
        };
    },
    updateFieldConfig: (newConfig) => {
        formTemplateState.updateFieldDetails({
            config: { ...formTemplateState.fieldDetails.config, ...newConfig },
        });
    },
});
