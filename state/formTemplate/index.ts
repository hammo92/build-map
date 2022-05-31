import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";
import { ModelRequired, StripModel } from "type-helpers";
import { proxy, useSnapshot } from "valtio";
import { Required } from "utility-types";
import { reorderArray } from "utils/arrayModify";

export const formTemplateState = proxy<{
    formTemplateId: string;
    activeFormTemplateFieldId: string;
    fieldDetails: Partial<FormTemplateField>;
    createFormTemplateModalOpen: boolean;
    updateFieldDetails: (newDetails: Partial<FormTemplateField>) => void;
}>({
    createFormTemplateModalOpen: false,
    formTemplateId: "",
    fieldDetails: {},
    activeFormTemplateFieldId: "",
    updateFieldDetails: (newDetails) => {
        formTemplateState.fieldDetails = {
            ...formTemplateState.fieldDetails,
            ...newDetails,
        };
    },
});
