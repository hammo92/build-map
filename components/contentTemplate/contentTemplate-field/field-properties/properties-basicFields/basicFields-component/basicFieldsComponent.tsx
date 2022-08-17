import { SmartForm } from "@components/smartForm";
import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { contentTemplateState } from "@state/contentTemplate";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { ComponentSelectItem } from "./componentSelectItem";

export const BasicFieldsComponent = () => {
    // get content templates from query store
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<{
        contentTemplates: CleanedCamel<ContentTemplate>[];
    }>([Keys.GET_ORGANISATION_CONTENT_TEMPLATES]);

    const { contentTemplateId } = useSnapshot(contentTemplateState);

    const selectData: any[] = [];
    data?.contentTemplates.forEach((template) => {
        // check if id matches parent template
        // prevent infinitely nested components
        const idMatchesParent = template.id === contentTemplateId;
        if (template.type === "component" && template.status === "published" && !idMatchesParent) {
            selectData.push({
                icon: template.icon,
                value: template.id,
                label: template.name,
            });
        }
    });

    return (
        <SmartForm.Select
            name="componentId"
            label="Select Component"
            required
            itemComponent={ComponentSelectItem}
            data={selectData}
        />
    );
};
