import { SmartForm } from "@components/smartForm";
import { Property } from "@lib/contentTemplate/data/types";
import { Grid, Stack } from "@mantine/core";
import { contentTemplateState, ContentTemplateStateProps } from "@state/contentTemplate";
import { FC } from "react";
import { useSnapshot } from "valtio";
import { FieldType } from "../../field-options/fieldsDefinitions";
import { BasicFieldsCommon } from "./basicFields-common";
import { BasicFieldsComponent } from "./basicFields-component";
import { BasicFieldsMultiSelect } from "./basicFields-multiSelect";
import { BasicFieldsRelation } from "./basicFields-relation";
import { BasicFieldsSelect } from "./basicFields-select";

const FieldTypeBaseFields: FC<{ type: FieldType }> = ({ type }) => {
    switch (type) {
        case "select":
            return <BasicFieldsSelect />;
        case "component":
            return <BasicFieldsComponent />;
        case "multiSelect":
            return <BasicFieldsMultiSelect />;
        case "relation":
            return <BasicFieldsRelation />;
        default:
            return null;
    }
};

export const PropertiesBasicFields: FC<{ type: FieldType }> = ({ type }) => {
    if (type) {
        return (
            <Stack spacing="sm">
                <BasicFieldsCommon type={type} />
                <FieldTypeBaseFields type={type} />
                <SmartForm.Textarea
                    name="description"
                    label="Description"
                    placeholder="A helpful tip about the field"
                />
            </Stack>
        );
    }
    return null;
};
