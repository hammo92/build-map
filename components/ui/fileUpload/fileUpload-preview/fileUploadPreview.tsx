import { Asset } from "@lib/asset/data/asset.model";
import { CleanedCamel } from "type-helpers";
import { mimeCategory } from "utils/asset";
import { FileUploadIcon } from "../fileUpload-icon";
import { FileUploadImage } from "../fileUpload-image";
interface FileUploadPreview {
    file: File;
    height?: number;
}

export const FileUploadPreview = ({ file, height }: FileUploadPreview) => {
    const category = mimeCategory(file.name);
    if (category === "image") return <FileUploadImage file={file} height={height} />;
    return <FileUploadIcon category={category} height={height} />;
};
