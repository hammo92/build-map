import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Stack } from "@mantine/core";
import { FC } from "react";
import { AdvancedFieldsCheckbox } from "./advancedFields-checkbox";
import { AdvancedFieldsCommon } from "./advancedFields-common";
import { AdvancedFieldsMultiSelect } from "./advancedFields-multiSelect";
import { AdvancedFieldsNumber } from "./advancedFields-number";
import { AdvancedFieldsSelect } from "./advancedFields-select";

const FieldTypeAdvancedFields = ({ type }: { type: FieldType }) => {
    switch (type) {
        case "checkbox":
            return <AdvancedFieldsCheckbox />;
        case "number":
            return <AdvancedFieldsNumber />;
        case "multiSelect":
            return <AdvancedFieldsMultiSelect />;
        case "select":
            return <AdvancedFieldsSelect />;
        default:
            return null;
    }
};

export const PropertiesAdvancedFields: FC<{
    type: FieldType;
}> = ({ type }) => {
    if (type) {
        return (
            <Stack spacing="sm">
                <AdvancedFieldsCommon />
                <FieldTypeAdvancedFields type={type} />
            </Stack>
        );
    }
    return null;
};
