import { SmartForm } from "@components/smartForm";
import { ContentFieldEmail, ContentFieldText } from "@lib/content/data/types";
import { PropertyEmail } from "@lib/contentTemplate/data/types";
import { Field, FieldType } from "@lib/field/data/field.model";
import { CleanedCamel } from "type-helpers";

export const FieldsEmail = ({ field }: { field: CleanedCamel<Field<"email">> }) => {
    return <SmartForm.TextInput type="email" name={field.id} label={field.name} />;
};
