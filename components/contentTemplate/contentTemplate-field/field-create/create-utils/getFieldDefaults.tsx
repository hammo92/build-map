import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { ContentTemplateField } from "@lib/contentTemplate/data/types";

const sharedDefaults = {
    name: "",
    permissions: {
        editableBy: "all" as const,
        visibleTo: "all" as const,
    },
};

export const getFieldDefaults = (type: FieldType): ContentTemplateField => {
    switch (type) {
        case "text":
            return { ...sharedDefaults, type: "text", subtype: "shortText" };
        case "number":
            return { ...sharedDefaults, type: "number", subtype: "integer" };
        case "checkbox":
            return { ...sharedDefaults, type: "checkbox", defaultValue: false };
        default:
            return { ...sharedDefaults, type };
    }
};
