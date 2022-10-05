import { SmartForm } from "@components/smartForm";
import { Field } from "@lib/field/data/field.model";
import { CleanedCamel } from "type-helpers";

export const FieldsNumber = ({ field }: { field: CleanedCamel<Field<"number">> }) => {
    return (
        <SmartForm.NumberInput
            precision={field.variant === "decimal" ? 2 : field.variant === "float" ? 5 : 0}
            name={field.id}
            label={field.name}
        />
    );
};
