import { FieldType, FIELD_TYPES } from "@components/contentType/constants";
import { ContentTypeField } from "@lib/contentType/data/contentType.model";

export const getFieldDefaultConfig = (type: FieldType) => {
    if (!type) return;
    let defaultConfig: ContentTypeField["config"] = {
        editableBy: "all",
        visibleTo: "all",
    };
    const subtypes = FIELD_TYPES[type]?.config?.subtype;
    if (subtypes) {
        defaultConfig = { ...defaultConfig, subtype: subtypes[0].type };
    }
    return defaultConfig;
};
