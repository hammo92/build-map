import { FIELD_TYPES } from "@components/formTemplate/constants";
import { FormTemplateField } from "@lib/formTemplate/data/formTemplate.model";

export const checkFieldValues = (fieldDetails: Partial<FormTemplateField>) => {
    if (!fieldDetails.type) {
        throw new Error("Type is required");
    }

    if (!fieldDetails.name) {
        throw new Error("Name is required");
    }

    //check for subtype
    const hasSubtype = FIELD_TYPES[fieldDetails.type].config?.subtype;
    const subtypeHasValue = fieldDetails.config?.subtype;
    if (hasSubtype && !subtypeHasValue) {
        throw new Error("Please select a subtype");
    }

    //check field specific values
    switch (fieldDetails.type) {
        case "select":
            if (
                !fieldDetails?.config?.options ||
                fieldDetails?.config?.options.length < 1
            ) {
                throw new Error(
                    "At least two options are required for a select field"
                );
            }
        default:
            return true;
    }
};
