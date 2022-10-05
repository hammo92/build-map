import { SmartForm } from "@components/smartForm";
import { ContentFieldMultiSelect, ContentFieldSelect } from "@lib/content/data/types";
import { PropertyMultiSelect } from "@lib/contentTemplate/data/types";
import { Field } from "@lib/field/data/field.model";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { commaListToArray } from "utils/arrayModify";

export const FieldsMultiSelect = ({ field }: { field: CleanedCamel<Field<"multiSelect">> }) => {
    return (
        <SmartForm.MultiSelect
            name={field.id}
            label={field.name}
            data={field.data ?? []}
            withinPortal={true}
        />
    );
};
