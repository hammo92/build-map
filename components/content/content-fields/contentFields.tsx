import { SmartFormImages } from "@components/smartForm/smartForm-images";
import { ContentField } from "@lib/content/data/types";
import { useEffect } from "react";
import { useFormContext } from "react-hook-form";
import { FieldsDate } from "./fields-date";
import { FieldsEmail } from "./fields-email";
import { FieldsImage } from "./fields-image";
import { FieldsMultiSelect } from "./fields-multiSelect";
import { FieldsNumber } from "./fields-number";
import { FieldsRichText } from "./fields-richText";
import { FieldsSelect } from "./fields-select";
import { FieldsText } from "./fields-text";

export const ContentFields = ({ fields }: { fields: ContentField[] }) => {
    const fieldList = fields
        .map((field) => {
            switch (field.type) {
                case "email":
                    return <FieldsEmail field={field} key={field.id} />;
                case "date":
                    return <FieldsDate field={field} key={field.id} />;
                case "multiSelect":
                    return <FieldsMultiSelect field={field} key={field.id} />;
                case "number":
                    return <FieldsNumber field={field} key={field.id} />;
                case "richText":
                    return <FieldsRichText field={field} key={field.id} />;
                case "select":
                    return <FieldsSelect field={field} key={field.id} />;
                case "text":
                    return <FieldsText field={field} key={field.id} />;
                case "image":
                    return <FieldsImage field={field} key={field.id} />;
            }
        })
        .filter((field) => field);
    return <>{fieldList}</>;
};
