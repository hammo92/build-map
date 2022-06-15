import { useGetOrganisationContentTemplates } from "@data/contentTemplate/hooks";
import { plural } from "pluralize";
import { capitalise } from "utils/stringTransform";
import { NavigationList } from "..";

export const LinkListContentTemplates = ({
    organisationId,
}: {
    organisationId: string;
}) => {
    const { data } = useGetOrganisationContentTemplates(organisationId);
    if (data?.contentTemplates) {
        return (
            <NavigationList
                items={data?.contentTemplates
                    ?.filter(
                        ({ status, type }) =>
                            status === "published" && type === "collection"
                    )
                    .map(({ name, icon }) => ({
                        link: `/content/${name}`,
                        icon: icon.icon,
                        colour: icon.color,
                        text: plural(capitalise(name)),
                    }))}
            />
        );
    }
    return null;
};
