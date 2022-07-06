import { SmartForm } from "@components/smartForm";
import { ContentFieldRichText } from "@lib/content/data/types";
import React from "react";

export const FieldsRichText = ({ field }: { field: ContentFieldRichText }) => (
    <SmartForm.RichText name={field.id} label={field.name} />
);
