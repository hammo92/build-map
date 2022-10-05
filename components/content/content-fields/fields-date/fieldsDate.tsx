import { SmartForm } from "@components/smartForm";
import { ContentFieldDate } from "@lib/content/data/types";
import { PropertyDate } from "@lib/contentTemplate/data/types";
import { Field } from "@lib/field/data/field.model";
import { CleanedCamel } from "type-helpers";
export const FieldsDate = ({ field }: { field: CleanedCamel<Field<"date">> }) => {
    switch (field.variant) {
        case "dateTime":
            return <SmartForm.DateTime name={field.id} label={field.name} />;
        case "date":
            return <SmartForm.DatePicker name={field.id} label={field.name} />;
        case "time":
            return <SmartForm.TimeInput name={field.id} label={field.name} />;
        default:
            return null;
    }
};
