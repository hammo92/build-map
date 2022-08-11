import {
    faBan,
    faCheckCircle,
    faCloudArrowUp,
    faTimesCircle,
} from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { MantineTheme, useMantineTheme } from "@mantine/core";

type DropzoneStatus = "accept" | "reject" | "idle";

function getIconProps(status: DropzoneStatus, theme: MantineTheme) {
    switch (status) {
        case "accept":
            return { color: theme.colors[theme.primaryColor][6], icon: faCheckCircle };
        case "reject":
            return { color: theme.colors.red[6], icon: faBan };
        case "idle":
            return { color: theme.colors.dark[0], icon: faCloudArrowUp };
    }
}

export const FileUploadDropzoneIcon = ({ status }: { status: DropzoneStatus }) => {
    const theme = useMantineTheme();
    return <FontAwesomeIcon {...getIconProps(status, theme)} size="2x" />;
};
