import { NavigationList } from "@components/navigation/linkList";
import { LinkListContentTemplates } from "@components/navigation/linkList/linkList-contentTemplates";
import { faCompassDrafting, faFile, faHouse, faUser } from "@fortawesome/pro-regular-svg-icons";
import { Stack } from "@mantine/core";
import { organisationState } from "@state/organisation";
import { useSnapshot } from "valtio";

export const SidebarProjects = () => {
    const { activeOrganisation } = useSnapshot(organisationState);
    return (
        <NavigationList
            items={[
                {
                    link: "/home",
                    icon: faHouse,
                    text: "Home",
                },
                {
                    link: "/contentTemplates",
                    icon: faFile,
                    text: "Content Templates",
                    active: false,
                },
                {
                    link: "/users",
                    icon: faUser,
                    text: "Users",
                },
            ]}
        />
    );
};
