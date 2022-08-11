import { NavigationList } from "@components/navigation/linkList";
import { LinkListContentTemplates } from "@components/navigation/linkList/linkList-contentTemplates";
import { faCompassDrafting, faHouse, faUser } from "@fortawesome/pro-regular-svg-icons";
import { Stack } from "@mantine/core";
import { organisationState } from "@state/organisation";
import { useSnapshot } from "valtio";

export const SidebarProjects = () => {
    const { activeOrganisation } = useSnapshot(organisationState);
    return (
        <Stack spacing="xs">
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
                <LinkListContentTemplates organisationId={activeOrganisation} />
            )}
        </Stack>
    );
};
