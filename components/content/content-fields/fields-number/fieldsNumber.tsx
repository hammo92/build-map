import { SmartForm } from "@components/smartForm";
import { ContentFieldNumber } from "@lib/content/data/types";
import { PropertyNumber } from "@lib/contentTemplate/data/types";

export const FieldsNumber = ({ field }: { field: ContentFieldNumber | PropertyNumber }) => {
    return (
        <SmartForm.NumberInput
            precision={field.variant === "decimal" ? 2 : field.variant === "float" ? 5 : 0}
            name={field.id}
            label={field.name}
        />
    );
};
