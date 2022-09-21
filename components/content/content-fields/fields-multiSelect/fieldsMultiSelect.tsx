import { SmartForm } from "@components/smartForm";
import { ContentFieldMultiSelect, ContentFieldSelect } from "@lib/content/data/types";
import { PropertyMultiSelect } from "@lib/contentTemplate/data/types";
import React from "react";
import { commaListToArray } from "utils/arrayModify";

export const FieldsMultiSelect = ({
    field,
}: {
    field: ContentFieldMultiSelect | PropertyMultiSelect;
}) => {
    return (
        <SmartForm.MultiSelect
            name={field.id}
            label={field.name}
            data={commaListToArray(field.data)}
            withinPortal={true}
        />
    );
};
