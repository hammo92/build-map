import { SmartForm } from "@components/smartForm";
import { ContentFieldEmail, ContentFieldText } from "@lib/content/data/types";
import { PropertyEmail } from "@lib/contentTemplate/data/types";

export const FieldsEmail = ({ field }: { field: ContentFieldEmail | PropertyEmail }) => {
    return <SmartForm.TextInput type="email" name={field.id} label={field.name} />;
};