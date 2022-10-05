import { SmartForm } from "@components/smartForm";
import { ContentFieldText } from "@lib/content/data/types";
import { PropertyText } from "@lib/contentTemplate/data/types";
import { Field } from "@lib/field/data/field.model";
import { CleanedCamel } from "type-helpers";

export const FieldsText = ({ field }: { field: CleanedCamel<Field<"text">> }) => {
    const { variant } = field;
    if (variant === "shortText") return <SmartForm.TextInput name={field.id} label={field.name} />;
    if (variant === "longText") return <SmartForm.Textarea name={field.id} label={field.name} />;
    return null;
};
