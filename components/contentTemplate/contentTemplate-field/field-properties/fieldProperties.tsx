import { SmartForm } from "@components/smartForm";
import { ContentTemplateField } from "@lib/contentTemplate/data/types";
import { Button, Group, Tabs } from "@mantine/core";
import { FC } from "react";
import { PropertiesAdvancedFields } from "./properties-advancedFields";
import { PropertiesBasicFields } from "./properties-basicFields";

export const FieldProperties: FC<{
    initialData: ContentTemplateField;
    onCancel?: () => void;
    onSubmit: (values: any) => void;
    action: "edit" | "create";
    isSubmitting?: boolean;
}> = ({ initialData, onCancel, onSubmit, isSubmitting, action }) => {
    return (
        <SmartForm onSubmit={onSubmit} formName="fieldBasicDetails" defaultValues={initialData}>
            <SmartForm.TextInput hidden name="type" />
            <Tabs grow>
                <Tabs.Tab label="Details">
                    <PropertiesBasicFields type={initialData.type} />
                </Tabs.Tab>
                <Tabs.Tab label="Advanced">
                    <PropertiesAdvancedFields type={initialData.type} />
                </Tabs.Tab>
            </Tabs>
            <Group grow mt="md">
                <Button
                    variant="light"
                    color="gray"
                    onClick={onCancel && onCancel}
                    disabled={isSubmitting}
                >
                    {action === "create" ? "Back" : "Cancel"}
                </Button>
                <Button type="submit" loading={isSubmitting} disabled={isSubmitting}>
                    {action === "create" ? "Create" : "Update"}
                </Button>
            </Group>
        </SmartForm>
    );
};
