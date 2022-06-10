import { useGetOrganisationContentTypes } from "@data/contentType/hooks";
import { plural } from "pluralize";
import { capitalise } from "utils/stringTransform";
import { NavigationList } from "..";

export const LinkListContentTypes = ({
    organisationId,
}: {
    organisationId: string;
}) => {
    const { data } = useGetOrganisationContentTypes(organisationId);
    if (data?.contentTypes) {
        return (
            <NavigationList
                items={data?.contentTypes
                    ?.filter(({ status }) => status === "published")
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
