import { SmartForm } from "@components/smartForm";
import { ContentFieldSelect } from "@lib/content/data/types";
import { PropertySelect } from "@lib/contentTemplate/data/types";
import React from "react";
import { commaListToArray } from "utils/arrayModify";

export const FieldsSelect = ({ field }: { field: ContentFieldSelect | PropertySelect }) => {
    return (
        <SmartForm.Select
            name={field.id}
            label={field.name}
            data={commaListToArray(field.data)}
            withinPortal={true}
        />
    );
};
