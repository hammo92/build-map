import { SmartForm } from "@components/smartForm";
import { ContentFieldDate } from "@lib/content/data/types";
import { PropertyDate } from "@lib/contentTemplate/data/types";
export const FieldsDate = ({ field }: { field: ContentFieldDate | PropertyDate }) => {
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
