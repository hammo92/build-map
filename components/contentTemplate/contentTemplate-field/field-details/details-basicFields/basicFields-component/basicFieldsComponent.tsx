import { Keys } from "@data/contentTemplate/constants";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Grid, Select } from "@mantine/core";
import { contentTemplateState } from "@state/contentTemplate";
import { useQueryClient } from "react-query";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { ComponentSelectItem } from "./componentSelectItem";

export const BasicFieldsComponent = () => {
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<{
        contentTemplates: CleanedCamel<ContentTemplate>[];
    }>([Keys.GET_ORGANISATION_CONTENT_TYPES]);
    const { updateFieldConfig, contentTemplateId } =
        useSnapshot(contentTemplateState);
    const onChange = (componentId: string) => {
        updateFieldConfig({
            componentId,
        });
    };
    const selectData: any[] = [];
    data?.contentTemplates.forEach((template) => {
        // check if id matches parent template
        // prevent infinitely nested components
        const idMatchesParent = template.id === contentTemplateId;
        if (
            template.type === "component" &&
            template.status === "published" &&
            !idMatchesParent
        ) {
            selectData.push({
                icon: template.icon,
                value: template.id,
                label: template.name,
            });
        }
    });

    return (
        <Grid.Col span={12}>
            <Select
                label="Select Component"
                required
                itemComponent={ComponentSelectItem}
                data={selectData}
                onChange={onChange}
            ></Select>
        </Grid.Col>
    );
};
