import { SmartForm } from "@components/smartForm";
import { ContentFieldNumber } from "@lib/content/data/types";

export const FieldsNumber = ({ field }: { field: ContentFieldNumber }) => (
    <SmartForm.NumberInput
        precision={field.subtype === "decimal" ? 2 : field.subtype === "float" ? 5 : 0}
        name={field.id}
        label={field.name}
    />
);
