import { FieldType } from "@lib/formTemplate/data/formTemplate.model";
import { Grid } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
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
    const { fieldDetails } = useSnapshot(formTemplateState);
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
