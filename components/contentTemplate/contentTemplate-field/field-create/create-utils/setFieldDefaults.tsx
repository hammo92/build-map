import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { ContentTemplateField } from "@lib/contentTemplate/data/contentTemplate.model";

export const getFieldDefaultConfig = (type: FieldType) => {
    if (!type) return;
    let defaultConfig: ContentTemplateField["config"] = {
        editableBy: "all",
        visibleTo: "all",
    };
    const subtypes = FIELD_TYPES[type]?.config?.subtype;
    if (subtypes) {
        defaultConfig = { ...defaultConfig, subtype: subtypes[0].type };
    }
    return defaultConfig;
};
