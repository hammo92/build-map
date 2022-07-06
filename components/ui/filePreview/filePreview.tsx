import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Group, Image, Loader, Modal, Sx, Text } from "@mantine/core";
import mime from "mime-types";
import { useState } from "react";
import { mimeCategory, mimeCategoryIcon } from "utils/asset";
import { formatBytes } from "utils/unitConversion";
import { useStyles } from "./styles";

interface FilePreviewProps {
    file: File;
    height?: number;
}

export const FilePreview = ({ file, height }: FilePreviewProps) => {
    const { classes } = useStyles();
    return (
        <Group
            className={classes.imageWrapper}
            position="center"
            sx={{
                height,
            }}
        >
            <Image src={URL.createObjectURL(file)} height={height} alt={file.name} />
        </Group>
    );
};
