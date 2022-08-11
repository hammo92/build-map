import { Group, Stack, Text } from "@mantine/core";
import { Dropzone, DropzoneProps } from "@mantine/dropzone";
import { megabytesToBytes } from "utils/unitConversion";
import { FileUploadDropzoneIcon } from "../fileUpload-DropzoneIcon";
import { useStyles } from "./styles";

export const FileUploadDropzone = ({
    onDrop,
    maxSize,
    disabled,
    multiple,
    accept,
    ...others
}: Omit<DropzoneProps, "children">) => {
    const { classes } = useStyles();
    return (
        <div className={classes.wrapper}>
            <Dropzone
                {...others}
                multiple={multiple}
                onDrop={onDrop}
                maxSize={maxSize && megabytesToBytes(maxSize)}
                className={classes.dropzone}
                accept={accept}
                disabled={disabled}
            >
                <div style={{ pointerEvents: "none" }}>
                    <Stack align="center" spacing="sm">
                        <Dropzone.Accept>
                            <FileUploadDropzoneIcon status="accept" />
                        </Dropzone.Accept>
                        <Dropzone.Reject>
                            <FileUploadDropzoneIcon status="reject" />
                        </Dropzone.Reject>
                        <Dropzone.Idle>
                            <FileUploadDropzoneIcon status="idle" />
                        </Dropzone.Idle>
                        <Text size="xl" inline align="center">
                            {multiple
                                ? "Drag files here or click to select files"
                                : "Drag file here or click to select file"}
                        </Text>

                        <Text size="sm" color="dimmed" align="center">
                            {multiple
                                ? `Add as many files as you like${
                                      maxSize ? `, each file should not exceed ${maxSize}mb` : ""
                                  }`
                                : `Add a file${
                                      maxSize ? `, file should not exceed ${maxSize}mb` : ""
                                  }`}
                        </Text>
                    </Stack>
                </div>
            </Dropzone>
        </div>
    );
};
