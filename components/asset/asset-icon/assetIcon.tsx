import { FontAwesomeIcon, FontAwesomeIconProps } from "@fortawesome/react-fontawesome";
import { Group } from "@mantine/core";
import { MimeCategory, mimeCategoryIcon } from "utils/asset";
import { useStyles } from "./styles";

interface AssetIconProps {
    category: MimeCategory;
    height?: number;
}

export const AssetIcon = ({ height = 150, category }: AssetIconProps) => {
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
