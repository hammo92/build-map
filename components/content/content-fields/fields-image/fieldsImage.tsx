import { SmartForm } from "@components/smartForm";
import { ContentFieldImage } from "@lib/content/data/types";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

export const FieldsImage = ({ field }: { field: ContentFieldImage }) => {
    const { subtype } = field;
    if (subtype === "single")
        return <SmartForm.Images name={field.id} label={field.name} accept={IMAGE_MIME_TYPE} />;
    if (subtype === "multiple")
        return (
            <SmartForm.Images
                multiple
                name={field.id}
                label={field.name}
                accept={IMAGE_MIME_TYPE}
            />
        );
    return null;
};
