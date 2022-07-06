import { faBan, faImage, faCloudArrowUp } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MantineTheme, useMantineTheme } from "@mantine/core";
import { DropzoneStatus } from "@mantine/dropzone";

function getIconColor(status: DropzoneStatus, theme: MantineTheme) {
    return status.accepted
        ? theme.colors[theme.primaryColor][6]
        : status.rejected
        ? theme.colors.red[6]
        : theme.colorScheme === "dark"
        ? theme.colors.dark[0]
        : theme.black;
}

export const ImageUploadIcon = ({ status }: { status: DropzoneStatus }) => {
    const theme = useMantineTheme();
    return (
        <FontAwesomeIcon
            icon={status.accepted ? faImage : status.rejected ? faBan : faCloudArrowUp}
            size="2x"
            color={getIconColor(status, theme)}
        />
    );
};
