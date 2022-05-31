import { faBan, faImage, faUpload } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useMantineTheme } from "@mantine/core";

function getIconColor(status, theme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][6]
        : status.rejected
        ? theme.colors.red[6]
        : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.black;
}

export const ImageUploadIcon = ({ status, ...props }) => {
    const theme = useMantineTheme();
    return (
        <FontAwesomeIcon
            icon={
                status.accepted ? faImage : status.rejected ? faBan : faUpload
            }
            size="4x"
            color={getIconColor(status, theme)}
        />
    );
};
