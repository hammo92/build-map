import { getContentTitle } from "@components/content/content-title";
import { SmartForm } from "@components/smartForm";
import { useGetProjectContentOfType } from "@data/content/hooks";
import { ContentFieldRelation } from "@lib/content/data/types";
import { PropertyRelation } from "@lib/contentTemplate/data/types";
import { useRouter } from "next/router";

export const FieldsRelation = ({ field }: { field: ContentFieldRelation | PropertyRelation }) => {
    const { query } = useRouter();
    const { projectId } = query;
    const { data, isLoading } = useGetProjectContentOfType({
        contentTemplateId: field.relatedTo,
        projectId: projectId as string,
    });
    return (
        <SmartForm.EditableList
            name={field.id}
            label={field.name}
            editable
            draggable
            placeholder={`Select ${data?.contentTemplate.name}`}
            loading={isLoading}
            data={
                data?.content.map((content) => ({
                    label: getContentTitle({ content, contentTemplate: data.contentTemplate }),
                    value: content.id,
                    ...content,
                })) ?? []
            }
        />
    );
};

//data={data?.content.map(({name, id}) => ({value:id, label:name}))}
