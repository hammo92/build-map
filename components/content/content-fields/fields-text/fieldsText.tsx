import { SmartForm } from "@components/smartForm";
import { ContentFieldText } from "@lib/content/data/types";
import { PropertyText } from "@lib/contentTemplate/data/types";

export const FieldsText = ({ field }: { field: ContentFieldText | PropertyText }) => {
    const { subtype } = field;
    if (subtype === "shortText") return <SmartForm.TextInput name={field.id} label={field.name} />;
    if (subtype === "longText") return <SmartForm.Textarea name={field.id} label={field.name} />;
    return null;
};
