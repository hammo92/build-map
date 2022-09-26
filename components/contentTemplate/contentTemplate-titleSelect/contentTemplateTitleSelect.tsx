import { SmartForm } from "@components/smartForm";
import { useUpdateContentTemplate } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import React from "react";
import { CleanedCamel } from "type-helpers";
import { capitalise } from "utils/stringTransform";

interface ContentTemplateTitleSelectProps {
    contentTemplate: CleanedCamel<ContentTemplate>;
}

export const ContentTemplateTitleSelect = ({
    contentTemplate,
}: ContentTemplateTitleSelectProps) => {
    const { mutateAsync } = useUpdateContentTemplate();
    const onSubmit = async ({ title }: { title: string }) => {
        const [type, value] = title.split("-");
        await mutateAsync({
            contentTemplateId: contentTemplate.id,
            title: {
                setType: "manual",
                type: type as "contentInfo" | "contentProperty",
                value,
            },
        });
    };
    const titlePropertyOptions = contentTemplate.properties
        .filter((property) => ["date", "email", "number", "text"].includes(property.type))
        .map(({ id, name }) => ({
            label: capitalise(name),
            value: `contentProperty-${id}`,
            group: "Property Value",
        }));
    return (
        <SmartForm
            formName="Title select"
            onSubmit={onSubmit}
            submitMethod="onChange"
            defaultValues={{
                title: `${contentTemplate.title.type}-${contentTemplate.title.value}`,
            }}
            key={contentTemplate.id}
        >
            <SmartForm.Select
                name="title"
                withinPortal={true}
                label="Title Property"
                description="For content created with this template"
                data={[
                    { label: "Id", value: "contentInfo-id", group: "Content Info" },
                    {
                        label: "Created At",
                        value: "contentInfo-createdTime",
                        group: "Content Info",
                    },
                    {
                        label: "Edited At",
                        value: "contentInfo-lastEditedTime",
                        group: "Content Info",
                    },
                    ...titlePropertyOptions,
                ]}
            />
        </SmartForm>
    );
};
