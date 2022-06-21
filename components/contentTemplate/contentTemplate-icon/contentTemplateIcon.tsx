import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ThemeIcon } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { IconEdit } from "./icon-edit/iconEdit";

export const ContentTemplateIcon = () => {
    const { contentTemplateId, hasEditPermission } = useSnapshot(contentTemplateState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTemplateResponse>([Keys.GET_CONTENT_TYPE, contentTemplateId]);

    if (data?.contentTemplate?.icon && hasEditPermission) return <IconEdit defaultValue={data.contentTemplate.icon} />;
    else if (data?.contentTemplate?.icon)
        return (
            <ThemeIcon color={data?.contentTemplate?.icon.color}>
                <FontAwesomeIcon icon={data?.contentTemplate.icon.icon} />
            </ThemeIcon>
        );
    return null;
};
