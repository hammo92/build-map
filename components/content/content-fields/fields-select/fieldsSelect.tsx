import { SmartForm } from "@components/smartForm";
import { ContentFieldSelect } from "@lib/content/data/types";
import { PropertySelect } from "@lib/contentTemplate/data/types";
import { Field } from "@lib/field/data/field.model";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { commaListToArray } from "utils/arrayModify";

export const FieldsSelect = ({ field }: { field: CleanedCamel<Field<"select">> }) => {
    return (
        <SmartForm.Select
            name={field.id}
            label={field.name}
            data={field.data ?? []}
            withinPortal={true}
        />
    );
};
