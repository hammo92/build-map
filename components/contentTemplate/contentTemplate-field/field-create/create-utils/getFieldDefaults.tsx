import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Property } from "@lib/contentTemplate/data/types";

const sharedDefaults = {
    name: "",
    permissions: {
        editableBy: "all" as const,
        visibleTo: "all" as const,
    },
};

export const getFieldDefaults = (type: FieldType): Property => {
    switch (type) {
        case "text":
            return { ...sharedDefaults, type: "text", variant: "shortText" };
        case "number":
            return { ...sharedDefaults, type: "number", variant: "integer" };
        case "checkbox":
            return { ...sharedDefaults, type: "checkbox", defaultValue: false };
        default:
            return { ...sharedDefaults, type };
    }
};
