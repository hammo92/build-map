import { SmartForm } from "@components/smartForm";
import { Property } from "@lib/contentTemplate/data/types";
import { Button, Group, Tabs } from "@mantine/core";
import { FC } from "react";
import { useFormContext } from "react-hook-form";
import { FieldType } from "../field-options/fieldsDefinitions";
import { PropertiesAdvancedFields } from "./properties-advancedFields";
import { PropertiesBasicFields } from "./properties-basicFields";

//Todo Fix typings for field options
interface FieldPropertiesProps {
    initialData: Property;
    onCancel?: () => void;
    onSubmit: (values: any) => void;
    action: "edit" | "create";
    isSubmitting?: boolean;
    fieldOptions?: Partial<
        Record<
            FieldType,
            {
                basic?: any;
                advanced?: any;
            }
        >
    >;
}

const Actions = ({
    action,
    onCancel,
    isSubmitting,
}: {
    onCancel?: () => void;
    action: "edit" | "create";
    isSubmitting?: boolean;
}) => {
    const { formState } = useFormContext();
    return (
        <Group grow mt="md">
            <Button
                variant="light"
                color="gray"
                onClick={onCancel && onCancel}
                disabled={isSubmitting}
            >
                {action === "create" ? "Back" : "Cancel"}
            </Button>
            <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !formState.isDirty}
            >
                {action === "create" ? "Create" : "Update"}
            </Button>
        </Group>
    );
};

export const FieldProperties = ({
    initialData,
    onCancel,
    onSubmit,
    isSubmitting,
    action,
    fieldOptions,
}: FieldPropertiesProps) => {
    const type = initialData.type;
    return (
        <SmartForm
            onSubmit={onSubmit}
            formName="fieldBasicDetails"
            defaultValues={initialData}
            submitType={"all"}
        >
            <SmartForm.TextInput hidden name="type" />
            <Tabs defaultValue="details">
                <Tabs.List grow>
                    <Tabs.Tab value="details">Details</Tabs.Tab>
                    <Tabs.Tab value="advanced">Advanced</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="details" py="sm">
                    <PropertiesBasicFields type={type} options={fieldOptions?.[type]?.basic} />
                </Tabs.Panel>
                <Tabs.Panel value="advanced" py="sm">
                    <PropertiesAdvancedFields type={type} />
                </Tabs.Panel>
            </Tabs>
            <Actions action={action} onCancel={onCancel} isSubmitting={isSubmitting} />
        </SmartForm>
    );
};
