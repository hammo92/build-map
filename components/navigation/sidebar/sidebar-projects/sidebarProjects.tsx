import { NavigationList } from "@components/navigation/linkList";
import { LinkListContentTypes } from "@components/navigation/linkList/linkList-contentTypes";
import {
    faCompassDrafting,
    faHouse,
    faUser,
} from "@fortawesome/pro-regular-svg-icons";
import { Group } from "@mantine/core";
import { organisationState } from "@state/organisation";
import { useSnapshot } from "valtio";

export const SidebarProjects = () => {
    const { activeOrganisation } = useSnapshot(organisationState);
    return (
        <Group direction="column" spacing="xs" grow>
            <NavigationList
                items={[
                    {
                        link: "/home",
                        icon: faHouse,
                        text: "Home",
                        active: true,
                    },
                    {
                        link: "drawings",
                        icon: faCompassDrafting,
                        text: "Drawings",
                    },
                    {
                        link: "/users",
                        icon: faUser,
                        text: "Users",
                    },
                ]}
            />
            {activeOrganisation.length > 1 && (
                <LinkListContentTypes organisationId={activeOrganisation} />
            )}
        </Group>
    );
};
