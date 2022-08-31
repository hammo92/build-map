import { FieldCard } from "@components/contentTemplate/contentTemplate-field/field-card";
import { SmartForm } from "@components/smartForm";
import { useUpdateContentFields } from "@data/content/hooks";
import { faExclamationCircle, faSensorAlert } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Content } from "@lib/content/data/content.model";
import { ContentField } from "@lib/content/data/types";
import { Button, Checkbox, Group, Modal, Stack, Text, Alert } from "@mantine/core";
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

const ContentFields = ({ fields }: { fields: ContentField[] }) => {
    const { watch, formState } = useFormContext();
    const values = watch();
    const allFalse = !Object.entries(values).some(([_, val]) => val === true);
    return (
        <Stack>
            {fields.map((field) => {
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
            {allFalse && (
                <Alert icon={<FontAwesomeIcon icon={faExclamationCircle} />} color="red">
                    At least one field must be visible
                </Alert>
            )}
            <Button type="submit" disabled={!formState.isDirty || allFalse}>
                Update
            </Button>
        </Stack>
    );
};

export const ContentFieldManager = ({ content }: { content: CleanedCamel<Content> }) => {
    const [opened, setOpened] = useState(false);
    const { mutateAsync } = useUpdateContentFields();

    // split into categories
    const templateFields = content.fields.reduce<ContentField[]>((acc, curr) => {
        if (curr.category === "template") {
            acc.push(curr);
        }
        return acc;
    }, []);

    const defaultValues = convertDataForSmartForm(templateFields);

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
                    <ContentFields fields={templateFields} />
                </SmartForm>
            </Modal>

            <Button size="xs" variant="subtle" onClick={() => setOpened(true)}>
                Manage Fields
            </Button>
        </>
    );
};
