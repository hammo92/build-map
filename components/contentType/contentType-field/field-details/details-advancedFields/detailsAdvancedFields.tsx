import { FieldType } from "@components/contentType/constants";
import { Grid } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
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
    const { fieldDetails } = useSnapshot(contentTypeState);
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
