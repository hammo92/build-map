import { useGetOrganisationContentTemplates } from "@data/contentTemplate/hooks";
import { useRouter } from "next/router";
import { plural } from "pluralize";
import { capitalise } from "utils/stringTransform";
import { NavigationList } from "..";

export const LinkListContentTemplates = ({ organisationId }: { organisationId: string }) => {
    const { data } = useGetOrganisationContentTemplates(organisationId);
    const { asPath } = useRouter();

    if (data?.contentTemplates) {
        return (
            <NavigationList
                items={data?.contentTemplates
                    ?.filter(
                        ({ status, templateType }) =>
                            status === "published" && templateType === "collection"
                    )
                    .map(({ name, icon, id }) => ({
                        //Todo fix links
                        link: `${asPath}/content/${id}`,
                        icon: icon.icon,
                        colour: icon.color,
                        text: plural(capitalise(name)),
                    }))}
            />
        );
    }
    return null;
};
