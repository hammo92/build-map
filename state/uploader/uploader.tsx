import { apiClient } from "@data/config";
import axios from "axios";
import { proxy, ref } from "valtio";

type Upload = {
    file: File;
    percentUploaded: number;
    uploading: boolean;
};

type callback = (assetIds: string[]) => void;
export interface UploadStateProps {
    uploads: Upload[];
    busy: boolean;
    errorMessage?: string;
    uploadSingleFile: ({
        file,
        index,
        path,
        onUpload,
    }: {
        file: File;
        index: number;
        path?: string;
        onUpload?: callback;
    }) => void;
    upload: ({ path, onUpload }: { path?: string; onUpload?: callback }) => void;
    addUploads: (...files: File[]) => void;
    removeUploads: (...indices: number[]) => void;
    setUploads: (files: File[]) => void;
    clearUploads: () => void;
    uploaded: string[];
}

export const UploadState = proxy<UploadStateProps>({
    uploads: [],
    busy: false,
    uploaded: [],
    uploadSingleFile: async ({ file, index, path, onUpload }) => {
        UploadState.busy = true;
        UploadState.uploads[index].uploading = true;
        const { data } = await apiClient.post(
            "/api/upload",
            {
                filename: file.name,
                path,
            },
            {
                headers: { "Content-Type": "application/json" },
            }
        );
        const { url, id } = data;
        await axios.put(url, file, {
            headers: {
                "Content-Type": file.type,
            },
            onUploadProgress: (p) => {
                UploadState.uploads[index].percentUploaded = Math.floor((p.loaded / p.total) * 100);
            },
        });

        UploadState.uploads[index].uploading = false;
        UploadState.uploaded = [...UploadState.uploaded, id];
        console.log("onUpload", onUpload);
        console.log("UploadState.uploaded", UploadState.uploaded);
        onUpload && onUpload(UploadState.uploaded);

        UploadState.busy = UploadState.uploads.filter(({ uploading }) => uploading).length > 0;
    },

    upload: async ({ path, onUpload }) => {
        UploadState.uploads.forEach(({ file, percentUploaded, uploading }, index) => {
            if (percentUploaded === 0 && !uploading) {
                UploadState.uploadSingleFile({ file, index, path, onUpload });
            }
        });
    },

    addUploads: (...files) => {
        files.forEach((file) =>
            UploadState.uploads.push({
                file: ref(file),
                percentUploaded: 0,
                uploading: false,
            })
        );
    },

    removeUploads: (...indices: number[]) => {
        indices.forEach((index) => {
            UploadState.uploads.splice(index, 1);
        });
    },

    clearUploads: () => {
        UploadState.uploads = [];
        UploadState.uploaded = [];
    },

    setUploads: (files) => {
        UploadState.uploads = files.map((file) => ({
            file: ref(file),
            percentUploaded: 0,
            uploading: false,
        }));
        UploadState.uploaded = [];
    },
});

export default UploadState;
