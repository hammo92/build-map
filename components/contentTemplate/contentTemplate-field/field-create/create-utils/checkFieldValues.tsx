import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Property } from "@lib/contentTemplate/data/types";
export const checkFieldValues = (fieldProperties: Partial<Property>) => {
    if (!fieldProperties.type) {
        throw new Error("Type is required");
    }

    if (!fieldProperties.name) {
        throw new Error("Name is required");
    }

    //check for subtype
    const hasSubtype = FIELD_TYPES[fieldProperties.type]?.subtypes;
    const subtypeHasValue = fieldProperties?.subtype;
    if (hasSubtype && !subtypeHasValue) {
        throw new Error("Please select a subtype");
    }

    //check field specific values
    switch (fieldProperties.type) {
        case "select":
            if (!fieldProperties?.data || fieldProperties?.data.length < 1) {
                throw new Error("At least two options are required for a select field");
            }
        default:
            return true;
    }
};
