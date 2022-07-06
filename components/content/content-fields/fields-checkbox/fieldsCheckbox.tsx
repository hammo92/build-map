import { SmartForm } from "@components/smartForm";
import { ContentFieldCheckbox } from "@lib/content/data/types";

export const FieldsCheckbox = ({ field }: { field: ContentFieldCheckbox }) => {
    return <SmartForm.Checkbox name={field.id} label={field.name} />;
};
