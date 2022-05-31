import { ActionIcon, Group, Image, Text } from "@mantine/core";
import { Dropzone, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import React, { useEffect, useState } from "react";
import { ImageUploadIcon } from "./imageUploadIcon";
import { useListState } from "@mantine/hooks";
import { faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

interface ImageUploadProps {
    //* whether to accept multiple files */
    multiple?: boolean;

    //* callback on file drop */
    onDrop?: (files: File[]) => void;

    //* max file size in bytes */
    maxFileSize?: number;
}

const megabytesToBytes = (mb: number): number => {
    return mb * (1 << 20);
};

export function formatBytes(bytes, decimals = 2) {
    if (bytes === 0) return "0 Bytes";

    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

const FilePreview = ({ fileWithPreview }) => {
    const { file, previewUrl, remove } = fileWithPreview;
    return (
        <Group position="apart">
            <Group>
                <Image
                    width={80}
                    src={previewUrl}
                    radius="md"
                    alt={file.name}
                />
                <Group direction="column" spacing={0}>
                    <Text>{file.name}</Text>
                    <Text size="sm" color="dimmed">
                        {formatBytes(file.size)}
                    </Text>
                </Group>
            </Group>
            <ActionIcon
                color="red"
                size="lg"
                variant="light"
                onClick={() => remove()}
            >
                <FontAwesomeIcon icon={faTrash} />
            </ActionIcon>
        </Group>
    );
};

export const ImageUpload: React.FC<ImageUploadProps> = ({
    multiple = true,
    onDrop,
    maxFileSize = 2,
}) => {
    const [droppedFiles, { append, remove }] = useListState([]);
    const handleDrop = (files: File[]) => {
        const previewFiles = files.map((file, i) => ({
            file,
            previewUrl: URL.createObjectURL(file),
            remove: () => remove(i),
        }));
        append(...previewFiles);
        onDrop && onDrop(files);
    };
    console.log("droppedFiles :>> ", droppedFiles);
    return (
        <Group grow direction="column">
            <Dropzone
                onDrop={handleDrop}
                maxSize={megabytesToBytes(maxFileSize)}
                accept={IMAGE_MIME_TYPE}
                multiple={multiple}
            >
                {(status) => (
                    <Group
                        position="center"
                        spacing="xl"
                        style={{ minHeight: 220, pointerEvents: "none" }}
                    >
                        <ImageUploadIcon status={status} />
                        <Group>
                            <Text size="xl" inline>
                                {multiple
                                    ? "Drag images here or click to select files"
                                    : "Drag image here or click to select file"}
                            </Text>
                            <Text size="sm" color="dimmed" inline mt={7}>
                                {multiple
                                    ? `Add as many images as you like, each file should not exceed ${maxFileSize}mb`
                                    : `Add an image, file should not exceed ${maxFileSize}mb`}
                            </Text>
                        </Group>
                    </Group>
                )}
            </Dropzone>
            {droppedFiles && (
                <Group direction="column" grow>
                    {droppedFiles.map((file, i) => (
                        <FilePreview key={i} fileWithPreview={file} />
                    ))}
                </Group>
            )}
        </Group>
    );
};
