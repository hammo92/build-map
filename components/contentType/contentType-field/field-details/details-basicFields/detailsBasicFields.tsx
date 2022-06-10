import { FIELD_TYPES } from "@components/contentType/constants";
import { FieldType } from "@components/contentType/constants";
import { Grid, Select, Textarea, TextInput } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { useSnapshot } from "valtio";
import { BasicFieldsCommon } from "./basicFields-common";
import { BasicFieldsSelect } from "./basicFields-select/basicFieldsSelect";

const FieldTypeBaseFields = ({ fieldType }: { fieldType: FieldType }) => {
    switch (fieldType) {
        case "select":
            return <BasicFieldsSelect />;
        default:
            return null;
    }
};

export const DetailsBasicFields = () => {
    const { fieldDetails } = useSnapshot(contentTypeState);
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
