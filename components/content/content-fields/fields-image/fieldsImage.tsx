import { SmartForm } from "@components/smartForm";
import { ContentFieldImage } from "@lib/content/data/types";
import { PropertyImage } from "@lib/contentTemplate/data/types";
import { Field } from "@lib/field/data/field.model";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { CleanedCamel } from "type-helpers";

export const FieldsImage = ({ field }: { field: CleanedCamel<Field<"image">> }) => {
    const { variant } = field;
    if (variant === "single")
        return <SmartForm.Assets name={field.id} label={field.name} accept={IMAGE_MIME_TYPE} />;
    if (variant === "multiple")
        return (
            <SmartForm.Assets
                multiple
                name={field.id}
                label={field.name}
                accept={IMAGE_MIME_TYPE}
            />
        );
    return null;
};
