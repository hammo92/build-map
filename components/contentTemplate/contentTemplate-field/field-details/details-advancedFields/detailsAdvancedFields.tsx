import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Grid } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { useSnapshot } from "valtio";
import { AdvancedFieldsBoolean } from "./advancedFields-boolean";
import { AdvancedFieldsCommon } from "./advancedFields-common";
import { AdvancedFieldsNumber } from "./advancedFields-number";
import { AdvancedFieldsSelect } from "./advancedFields-select";

const FieldTypeBaseFields = ({ fieldType }: { fieldType: FieldType }) => {
    switch (fieldType) {
        case "select":
            return <AdvancedFieldsSelect />;
        case "boolean":
            return <AdvancedFieldsBoolean />;
        case "number":
            return <AdvancedFieldsNumber />;
        default:
            return null;
    }
};

export const DetailsAdvancedFields = () => {
    const { fieldDetails } = useSnapshot(contentTemplateState);
    const { type } = fieldDetails;
    if (type) {
        return (
            <Grid py="sm">
                <AdvancedFieldsCommon />
                <FieldTypeBaseFields fieldType={type} />
            </Grid>
        );
    }
    return null;
};
