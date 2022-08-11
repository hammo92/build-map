import { Button, Group } from "@mantine/core";
import { DropzoneProps } from "@mantine/dropzone";
import { useId } from "@mantine/hooks";
import { useModals } from "@mantine/modals";
import Uploader from "@state/uploader/uploader";
import React, { useEffect, useMemo } from "react";
import { proxy, useSnapshot } from "valtio";
import { FileUploadDropzone } from "./fileUpload-Dropzone";
import { FileUploadList } from "./fileUpload-list";

export type ImageUploadProps = Omit<DropzoneProps, "children" | "onDrop"> & {
    path?: string;
    onUpload: (fileIds: string[]) => void;
    onCancel?: () => void;
};

const UploadManager = ({
    maxSize,
    disabled,
    multiple,
    onUpload,
    onCancel,
    ...others
}: Omit<ImageUploadProps, "onDrop">) => {
    const modals = useModals();
    const { uploads, setUploads, addUploads, busy, upload, ...rest } = useSnapshot(Uploader);
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
                        <Button color="gray" disabled={busy} onClick={onCancel}>
                            Back
                        </Button>
                        <Button
                            disabled={busy || notUploaded.length === 0}
                            loading={busy}
                            onClick={() => upload({ onUpload })}
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
    const openUploadManagerModal = () => {
        modals.openModal({
            size: "xl",
            title: `Add new asset${multiple ? "s" : ""}`,
            //id: "assetManagerModal",
            closeOnClickOutside: false,
            onClose: () => {
                Uploader.clearUploads();
            },
            children: (
                <UploadManager
                    onUpload={onUpload}
                    multiple={multiple}
                    maxSize={maxSize}
                    onCancel={() => modals.closeModal("assetManagerModal")}
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
