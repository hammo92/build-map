import { SmartForm } from "@components/smartForm";
import { ContentFieldImage } from "@lib/content/data/types";
import { PropertyImage } from "@lib/contentTemplate/data/types";
import { IMAGE_MIME_TYPE } from "@mantine/dropzone";

export const FieldsImage = ({ field }: { field: ContentFieldImage | PropertyImage }) => {
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
