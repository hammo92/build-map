import { Button, Group } from "@mantine/core";
import { DropzoneProps } from "@mantine/dropzone";
import { useModals } from "@mantine/modals";
import uploader, { UploadState } from "@state/uploader/uploader";
import React from "react";
import { useSnapshot } from "valtio";
import { FileUploadDropzone } from "./fileUpload-Dropzone";
import { FileUploadList } from "./fileUpload-list";

export type ImageUploadProps = Omit<DropzoneProps, "children" | "onDrop"> & {
    path?: string;
    onUpload: (fileIds: string[]) => void;
};

const UploadManager = ({
    maxSize,
    disabled,
    multiple,
    onUpload,
    ...others
}: Omit<ImageUploadProps, "onDrop">) => {
    const { uploads, setUploads, addUploads, busy, upload } = useSnapshot(uploader);
    const handleDrop = (files: File[]) => {
        multiple ? addUploads(...files) : setUploads(files);
    };

    const notUploaded = uploads.filter(
        ({ percentUploaded, uploading }) => percentUploaded === 0 && !uploading
    );

    return (
        <div>
            <FileUploadDropzone
                onDrop={handleDrop}
                multiple={multiple}
                maxSize={maxSize}
                {...others}
            />
            {uploads.length ? (
                <>
                    <FileUploadList />
                    <Group position="apart">
                        <Button color="gray" disabled={busy}>
                            Back
                        </Button>
                        <Button
                            disabled={busy || notUploaded.length === 0}
                            loading={busy}
                            onClick={() => upload()}
                        >
                            Upload
                        </Button>
                    </Group>
                </>
            ) : null}
        </div>
    );
};

export const FileUpload: React.FC<ImageUploadProps> = ({
    multiple,
    maxSize,
    path,
    onUpload,
    ...others
}) => {
    const modals = useModals();
    UploadState.onUpload = onUpload;
    const openUploadManagerModal = () => {
        modals.openModal({
            size: "xl",
            title: `Add new asset${multiple ? "s" : ""}`,
            id: "assetManagerModal",
            closeOnClickOutside: false,
            children: (
                <UploadManager
                    onUpload={(assets) => console.log(assets)}
                    multiple={multiple}
                    maxSize={maxSize}
                    {...others}
                />
            ),
        });
    };

    return (
        <Button size="xs" variant="subtle" onClick={() => openUploadManagerModal()}>
            {multiple ? "Add Assets" : "Add Asset"}
        </Button>
    );
};
