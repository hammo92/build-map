import { SmartForm } from "@components/smartForm";
import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { Grid } from "@mantine/core";
import { contentTemplateState, ContentTemplateStateProps } from "@state/contentTemplate";
import { FC } from "react";
import { useSnapshot } from "valtio";
import { FieldType } from "../../field-options/fieldsDefinitions";
import { BasicFieldsCommon } from "./basicFields-common";
import { BasicFieldsComponent } from "./basicFields-component";
import { BasicFieldsMultiSelect } from "./basicFields-multiSelect";
import { BasicFieldsSelect } from "./basicFields-select";

const FieldTypeBaseFields: FC<{ type: FieldType }> = ({ type }) => {
    switch (type) {
        case "select":
            return <BasicFieldsSelect />;
        case "component":
            return <BasicFieldsComponent />;
        case "multiSelect":
            return <BasicFieldsMultiSelect />;
        default:
            return null;
    }
};

export const PropertiesBasicFields: FC<{ type: FieldType }> = ({ type }) => {
    if (type) {
        return (
            <>
                <BasicFieldsCommon type={type} />
                <FieldTypeBaseFields type={type} />
            </>
        );
    }
    return null;
};
