import { FIELD_TYPES } from "@components/formTemplate/constants";
import {
    FieldType,
    FormTemplateField,
} from "@lib/formTemplate/data/formTemplate.model";

export const getFieldDefaultConfig = (type: FieldType) => {
    if (!type) return;
    let defaultConfig: FormTemplateField["config"] = {
        editableBy: "all",
        visibleTo: "all",
    };
    const subtypes = FIELD_TYPES[type]?.config?.subtype;
    if (subtypes) {
        defaultConfig = { ...defaultConfig, subtype: subtypes[0].type };
    }
    return defaultConfig;
};
