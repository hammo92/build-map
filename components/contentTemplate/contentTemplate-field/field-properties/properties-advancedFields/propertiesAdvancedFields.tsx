import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Group } from "@mantine/core";
import { FC } from "react";
import { AdvancedFieldsCheckbox } from "./advancedFields-checkbox";
import { AdvancedFieldsCommon } from "./advancedFields-common";
import { AdvancedFieldsNumber } from "./advancedFields-number";
import { AdvancedFieldsSelect } from "./advancedFields-select";

const FieldTypeAdvancedFields = ({ type }: { type: FieldType }) => {
    switch (type) {
        case "select":
            return <AdvancedFieldsSelect />;
        case "checkbox":
            return <AdvancedFieldsCheckbox />;
        case "number":
            return <AdvancedFieldsNumber />;
        default:
            return null;
    }
};

export const PropertiesAdvancedFields: FC<{ type: FieldType }> = ({ type }) => {
    if (type) {
        return (
            <Group direction="column" grow spacing="sm">
                <AdvancedFieldsCommon />
                <FieldTypeAdvancedFields type={type} />
            </Group>
        );
    }
    return null;
};
