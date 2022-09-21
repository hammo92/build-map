import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Property } from "@lib/contentTemplate/data/types";
export const checkFieldValues = (fieldProperties: Partial<Property>) => {
    if (!fieldProperties.type) {
        throw new Error("Type is required");
    }

    if (!fieldProperties.name) {
        throw new Error("Name is required");
    }

    //check for variant
    const hasvariant = FIELD_TYPES[fieldProperties.type]?.variants;
    const variantHasValue = fieldProperties?.variant;
    if (hasvariant && !variantHasValue) {
        throw new Error("Please select a variant");
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
