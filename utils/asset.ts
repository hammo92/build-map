import {
    faFileExcel,
    faFilePowerpoint,
    faFileVideo,
    faFileZipper,
} from "@fortawesome/pro-regular-svg-icons";
import { faFile, faFileCsv, faFilePdf, faFileWord } from "@fortawesome/pro-solid-svg-icons";
import {
    IMAGE_MIME_TYPE,
    MIME_TYPES,
    MS_EXCEL_MIME_TYPE,
    MS_POWERPOINT_MIME_TYPE,
    MS_WORD_MIME_TYPE,
    PDF_MIME_TYPE,
} from "@mantine/dropzone";
import mime from "mime-types";

export type MimeCategory =
    | keyof typeof MIME_TYPES
    | "image"
    | "pdf"
    | "msWord"
    | "msExcel"
    | "msPowerpoint"
    | "file";

export const mimeCategory = (identifier: string): MimeCategory => {
    const mimeType = mime.lookup(identifier);
    switch (true) {
        case IMAGE_MIME_TYPE.includes(mimeType as typeof IMAGE_MIME_TYPE[number]):
            return "image";
        case PDF_MIME_TYPE.includes(mimeType as typeof PDF_MIME_TYPE[number]):
            return "pdf";
        case MS_WORD_MIME_TYPE.includes(mimeType as typeof MS_WORD_MIME_TYPE[number]):
            return "msWord";
        case MS_EXCEL_MIME_TYPE.includes(mimeType as typeof MS_EXCEL_MIME_TYPE[number]):
            return "msExcel";
        case MS_POWERPOINT_MIME_TYPE.includes(mimeType as typeof MS_POWERPOINT_MIME_TYPE[number]):
            return "msPowerpoint";
        case Object.values(MIME_TYPES).includes(
            mimeType as typeof MIME_TYPES[keyof typeof MIME_TYPES]
        ):
            // Get key for matching value from MIME_TYPES object
            return Object.keys(MIME_TYPES)[
                Object.values(MIME_TYPES).findIndex((value) => value === mimeType)
            ] as keyof typeof MIME_TYPES;
        default:
            return "file";
    }
};

export const mimeCategoryIcon = (mimeCategory: MimeCategory) => {
    switch (mimeCategory) {
        case "mp4":
            return faFileVideo;
        case "zip":
            return faFileZipper;
        case "csv":
            return faFileCsv;
        case "pdf":
            return faFilePdf;
        case "msWord":
            return faFileWord;
        case "msExcel":
            return faFileExcel;
        case "msPowerpoint":
            return faFilePowerpoint;
        case "file":
            return faFile;
        default:
            return faFile;
    }
};
