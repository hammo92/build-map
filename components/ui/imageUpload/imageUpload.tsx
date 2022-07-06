import { faEdit, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    ActionIcon,
    Button,
    extractSystemStyles,
    Group,
    InputBaseProps,
    InputWrapper,
    InputWrapperBaseProps,
    Modal,
    Paper,
    Text,
} from "@mantine/core";
import { Dropzone, DropzoneProps, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import { useListState, useUncontrolled, useUuid } from "@mantine/hooks";
import React, { ComponentPropsWithoutRef, forwardRef, useState, useEffect } from "react";
import { megabytesToBytes } from "utils/unitConversion";
import { FilePreview as Preview } from "../filePreview";
import ImageEditor from "../imageEditor";
import { ImageUploadIcon } from "./imageUploadIcon";
import { useStyles } from "./styles";

export type ImageUploadProps = Omit<DropzoneProps, "children" | "onDrop"> &
    Omit<InputWrapperBaseProps, "children"> &
    InputBaseProps &
    Omit<ComponentPropsWithoutRef<"input">, "value" | "onChange" | "size" | "defaultValue"> & {
        onChange?: (files: File[]) => void;
        defaultValue?: File[];
        value?: File[];
    };

const FilePreview = ({
    file,
    remove,
    update,
}: {
    file: File;
    remove: () => void;
    update: (file: File) => void;
}) => {
    const [opened, setOpened] = useState(false);
    return (
        <>
            <Paper sx={(theme) => ({ background: theme.colors.dark[8] })} p="md">
                <Group position="apart">
                    <Preview file={file} />
                    <Group spacing="sm">
                        <ActionIcon size="lg" variant="light" onClick={() => setOpened(true)}>
                            <FontAwesomeIcon icon={faEdit} />
                        </ActionIcon>
                        <ActionIcon color="red" size="lg" variant="light" onClick={() => remove()}>
                            <FontAwesomeIcon icon={faTrash} />
                        </ActionIcon>
                    </Group>
                </Group>
            </Paper>
            <Modal opened={opened} onClose={() => setOpened(false)} size="90%" title="Edit Image">
                <ImageEditor
                    file={file}
                    onSave={(file) => {
                        setOpened(false);
                        //short delay to avoid rerender flash in image editor
                        setTimeout(() => update(file), 500);
                    }}
                />
            </Modal>
        </>
    );
};

export const ImageUpload: React.FC<ImageUploadProps> = forwardRef(
    (
        {
            description,
            descriptionProps,
            error,
            errorProps,
            defaultValue,
            onChange,
            value,
            label,
            labelProps,
            required,
            maxSize = 2,
            size,
            onDrop,
            multiple,
            onFocus,
            wrapperProps,
            className,
            style,
            sx,
            name,
            onBlur,
            classNames,
            styles,
            id,
            ...others
        },
        ref
    ) => {
        const { classes, cx, theme } = useStyles();
        const { systemStyles, rest } = extractSystemStyles(others);
        const [droppedFiles, { append, remove, setItem, setState }] = useListState<File>([]);
        const handleDrop = (files: File[]) => {
            append(...files);
        };
        const [_value, handleChange, inputMode] = useUncontrolled({
            value,
            defaultValue,
            finalValue: [],
            onChange: onChange!,
            rule: (val) => typeof val === "object",
        });
        useEffect(() => {
            handleChange(droppedFiles);
        }, [droppedFiles]);

        const uuid = useUuid(id);
        return (
            <InputWrapper
                required={required}
                id={uuid}
                label={label}
                error={error}
                description={description}
                size={size}
                className={className}
                style={style}
                classNames={classNames}
                styles={styles}
                __staticSelector="Select"
                sx={sx}
                errorProps={errorProps}
                descriptionProps={descriptionProps}
                labelProps={labelProps}
                {...systemStyles}
                {...wrapperProps}
            >
                <div className={classes.wrapper}>
                    <Dropzone
                        {...others}
                        multiple={multiple}
                        onDrop={handleDrop}
                        maxSize={megabytesToBytes(maxSize)}
                        className={classes.dropzone}
                        accept={IMAGE_MIME_TYPE}
                    >
                        {(status) => (
                            <div style={{ pointerEvents: "none" }}>
                                <Group position="center" direction="column" grow spacing="sm">
                                    <ImageUploadIcon status={status} />

                                    <Text size="xl" inline align="center">
                                        {multiple
                                            ? "Drag files here or click to select files"
                                            : "Drag file here or click to select file"}
                                    </Text>

                                    <Text size="sm" color="dimmed" align="center">
                                        {multiple
                                            ? `Add as many files as you like, each file should not exceed ${maxSize}mb`
                                            : `Add a file, file should not exceed ${maxSize}mb`}
                                    </Text>
                                </Group>
                            </div>
                        )}
                    </Dropzone>
                    {droppedFiles.length ? (
                        <>
                            <Group p="md" grow>
                                {droppedFiles.map((file, i) => (
                                    <FilePreview
                                        key={i}
                                        file={file}
                                        remove={() => remove(i)}
                                        update={(item: File) => setItem(i, item)}
                                    />
                                ))}
                            </Group>
                            <Group
                                position="apart"
                                p="md"
                                sx={(theme) => ({ background: theme.colors.dark[6] })}
                            >
                                <Button color="gray" onClick={() => setState([])}>
                                    Clear
                                </Button>
                                <Button>Upload images</Button>
                            </Group>
                        </>
                    ) : null}
                </div>
            </InputWrapper>
        );
    }
);

ImageUpload.displayName = "ImageUpload";
