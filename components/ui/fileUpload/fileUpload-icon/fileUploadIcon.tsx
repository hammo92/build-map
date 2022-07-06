import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Group } from "@mantine/core";
import { MimeCategory, mimeCategoryIcon } from "utils/asset";
import { useStyles } from "./styles";

interface FileUploadIconProps {
    category: MimeCategory;
    height?: number;
}

export const FileUploadIcon = ({ height = 150, category }: FileUploadIconProps) => {
    const { classes } = useStyles();
    return (
        <Group position="center" sx={{ height }} className={classes.iconWrapper}>
            <FontAwesomeIcon
                icon={mimeCategoryIcon(category)}
                size={`${Math.ceil(height / 40)}x` as FontAwesomeIconProps["size"]}
            />
        </Group>
    );
};
