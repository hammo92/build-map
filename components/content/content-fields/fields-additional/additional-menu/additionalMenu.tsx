import { faEllipsis, faFile, faNote, faTasks } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentField } from "@lib/content/data/types";
import { ActionIcon, Menu, useMantineTheme } from "@mantine/core";
import { MenuAddAssets } from "./menu-addAssets";
import { MenuAddNote } from "./menu-addNote";

export const AdditionalMenu = ({ field }: { field: ContentField }) => {
    const theme = useMantineTheme();
    return (
        <Menu withArrow withinPortal>
            <Menu.Target>
                <ActionIcon
                    sx={{
                        position: "absolute",
                        top: `${theme.spacing.sm}px`,
                        right: `${theme.spacing.sm}px`,
                    }}
                    size="sm"
                >
                    <FontAwesomeIcon icon={faEllipsis} />
                </ActionIcon>
            </Menu.Target>

            <Menu.Dropdown>
                <Menu.Label>Additional Info</Menu.Label>
                <MenuAddNote field={field} />
                <MenuAddAssets field={field} />
                <Menu.Divider />
                <Menu.Label>Linked</Menu.Label>
                <Menu.Item icon={<FontAwesomeIcon icon={faTasks} />}>Task</Menu.Item>
            </Menu.Dropdown>
        </Menu>
    );
};
