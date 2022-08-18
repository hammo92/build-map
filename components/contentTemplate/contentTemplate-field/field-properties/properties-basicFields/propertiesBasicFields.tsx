import { SmartForm } from "@components/smartForm";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Property } from "@lib/contentTemplate/data/types";
import { Grid, Stack } from "@mantine/core";
import { contentTemplateState, ContentTemplateStateProps } from "@state/contentTemplate";
import { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { FieldType } from "../../field-options/fieldsDefinitions";
import { BasicFieldsCommon } from "./basicFields-common";
import { BasicFieldsComponent } from "./basicFields-component";
import { BasicFieldsMultiSelect } from "./basicFields-multiSelect";
import { BasicFieldsRelation, BasicFieldsRelationProps } from "./basicFields-relation";
import { BasicFieldsSelect } from "./basicFields-select";

interface BasicFieldOptions {
    relation: BasicFieldsRelationProps;
}

interface PropertiesBasicFieldsProps {
    type: FieldType;
    options: Record<string, any>;
    contentTemplate: CleanedCamel<ContentTemplate>;
}

const FieldTypeBaseFields = ({ type, options, contentTemplate }: PropertiesBasicFieldsProps) => {
    switch (type) {
        case "select":
            return <BasicFieldsSelect />;
        case "component":
            return <BasicFieldsComponent />;
        case "multiSelect":
            return <BasicFieldsMultiSelect />;
        case "relation":
            return <BasicFieldsRelation {...options} contentTemplate={contentTemplate} />;
        default:
            return null;
    }
};

export const PropertiesBasicFields = ({
    type,
    options,
    contentTemplate,
}: PropertiesBasicFieldsProps) => {
    if (type) {
        return (
            <Stack spacing="sm">
                <BasicFieldsCommon type={type} options={options} />
                <FieldTypeBaseFields
                    type={type}
                    options={options}
                    contentTemplate={contentTemplate}
                />
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
