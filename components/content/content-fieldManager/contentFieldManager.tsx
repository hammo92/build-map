import { FieldCard } from "@components/contentTemplate/contentTemplate-field/field-card";
import { SmartForm } from "@components/smartForm";
import { useUpdateContentFields } from "@data/content/hooks";
import { Content } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { Button, Checkbox, Group, Modal, Stack, Text } from "@mantine/core";
import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CleanedCamel } from "type-helpers";
import { Required } from "utility-types";

function convertDataForSmartForm(fields: Required<Partial<ContentField>, "id">[]) {
    return fields.reduce((ac, a) => ({ ...ac, [a.id]: a.active ?? null }), {});
}

function convertFormDataForUpdate({
    fields,
    values,
}: {
    fields: ContentField[];
    values: Record<string, boolean>;
}) {
    return fields.reduce<ContentField[]>((acc, field) => {
        const value = values[field.id];
        if ((value === true && !field.active) || (value === false && field.active)) {
            acc.push({ ...field, active: value });
        }
        return acc;
    }, []);
}

const ContentFields = ({ content }: { content: CleanedCamel<Content> }) => {
    const { formState, watch } = useFormContext();
    return (
        <Stack>
            {content.fields.map((field) => {
                return (
                    <FieldCard
                        key={field.id}
                        field={field}
                        withActions={false}
                        withDrag={false}
                        leftContent={<SmartForm.Checkbox name={field.id} />}
                    />
                );
            })}
            <Button type="submit">Save</Button>
        </Stack>
    );
};

export const ContentFieldManager = ({ content }: { content: CleanedCamel<Content> }) => {
    const [opened, setOpened] = useState(false);
    const defaultValues = convertDataForSmartForm(content?.fields);
    const { mutateAsync } = useUpdateContentFields();
    return (
        <>
            <Modal
                opened={opened}
                onClose={() => setOpened(false)}
                title="Active Fields"
                closeOnClickOutside={false}
            >
                <SmartForm
                    formName="fieldManager"
                    onSubmit={(values: Record<string, boolean>) => {
                        console.log("values", values);
                        console.log(
                            "convertFormDataForUpdate :>> ",
                            convertFormDataForUpdate({ fields: content.fields, values })
                        );
                        mutateAsync({
                            contentId: content.id,
                            updates: convertFormDataForUpdate({ fields: content.fields, values }),
                        });
                    }}
                    defaultValues={defaultValues}
                >
                    <ContentFields content={content} />
                </SmartForm>
            </Modal>

            <Button size="xs" variant="subtle" onClick={() => setOpened(true)}>
                Manage Fields
            </Button>
        </>
    );
};
