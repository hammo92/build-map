import { SmartForm } from "@components/smartForm";
import { ContentFieldEmail, ContentFieldText } from "@lib/content/data/types";

export const FieldsEmail = ({ field }: { field: ContentFieldEmail }) => {
    return <SmartForm.TextInput type="email" name={field.id} label={field.name} />;
};
