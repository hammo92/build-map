import { SmartForm } from "@components/smartForm";
import { ContentFieldSelect } from "@lib/content/data/types";
import React from "react";
import { commaListToArray } from "utils/arrayModify";

export const FieldsSelect = ({ field }: { field: ContentFieldSelect }) => {
    return (
        <SmartForm.Select name={field.id} label={field.name} data={commaListToArray(field.data)} />
    );
};
