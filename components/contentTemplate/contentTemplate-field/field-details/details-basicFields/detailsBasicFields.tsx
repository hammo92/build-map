import { FIELD_TYPES } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { Grid, Select, Textarea, TextInput } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import React from "react";
import { useSnapshot } from "valtio";
import { BasicFieldsCommon } from "./basicFields-common";
import { BasicFieldsComponent } from "./basicFields-component";
import { BasicFieldsSelect } from "./basicFields-select/basicFieldsSelect";

const FieldTypeBaseFields = ({ fieldType }: { fieldType: FieldType }) => {
    switch (fieldType) {
        case "select":
            return <BasicFieldsSelect />;
        case "component":
            return <BasicFieldsComponent />;
        default:
            return null;
    }
};

export const DetailsBasicFields = () => {
    const { fieldDetails } = useSnapshot(contentTemplateState);
    const { type } = fieldDetails;
    if (type) {
        return (
            <Grid py="sm">
                <BasicFieldsCommon />
                <FieldTypeBaseFields fieldType={type} />
            </Grid>
        );
    }
    return null;
};
