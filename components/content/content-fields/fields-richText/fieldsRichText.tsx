import { SmartForm } from "@components/smartForm";
import { ContentFieldRichText } from "@lib/content/data/types";
import { PropertyRichText } from "@lib/contentTemplate/data/types";
import React from "react";

export const FieldsRichText = ({ field }: { field: ContentFieldRichText | PropertyRichText }) => (
    <SmartForm.RichText name={field.id} label={field.name} />
);
