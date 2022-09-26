import { FieldTypes, Property } from "@lib/field/data/field.model";

const sharedDefaults = {
    name: "",
    permissions: {
        editableBy: "all" as const,
        visibleTo: "all" as const,
    },
};

export const getFieldDefaults = (type: FieldTypes): Partial<Property> => {
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
