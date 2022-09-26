import { SmartForm } from "@components/smartForm";
import { FieldTypes, Property } from "@lib/field/data/field.model";
import { Button, ButtonProps, Group, Tabs } from "@mantine/core";
import React from "react";
import { useFormContext } from "react-hook-form";
import { ConfigurationFields } from "./configuration-fields";

interface ButtonsProps {
    onCancel?: () => void;
    submitButtonProps?: ButtonProps & { text: string; hidden?: boolean };
    isSubmitting?: boolean;
    cancelButtonProps?: ButtonProps & { text: string; hidden?: boolean };
    view?: "edit" | "create";
}

interface PropertyConfigurationProps<T extends FieldTypes> extends ButtonsProps {
    type: T;
    currentConfig?: Partial<Property<T>>;
    onSubmit: (values: any) => void;
}

const Buttons = ({
    view,
    cancelButtonProps,
    isSubmitting,
    onCancel,
    submitButtonProps,
}: ButtonsProps) => {
    const { formState } = useFormContext();
    return (
        <Group grow mt="md">
            {onCancel && (
                <Button
                    variant="light"
                    color="gray"
                    onClick={onCancel}
                    disabled={isSubmitting}
                    {...cancelButtonProps}
                >
                    {cancelButtonProps?.text ?? view === "edit" ? "Cancel" : "Back"}
                </Button>
            )}
            <Button
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting || !formState.isDirty}
                {...submitButtonProps}
            >
                {submitButtonProps?.text ?? view === "create" ? "Create" : "Update"}
            </Button>
        </Group>
    );
};

export const PropertyConfiguration = <T extends FieldTypes>({
    type,
    currentConfig,
    onSubmit,
    onCancel,
    submitButtonProps,
    isSubmitting,
    cancelButtonProps,
    view = "create",
}: PropertyConfigurationProps<T>) => {
    return (
        <SmartForm onSubmit={onSubmit} formName="fieldBasicDetails" defaultValues={currentConfig}>
            <SmartForm.TextInput hidden name="type" />
            <Tabs defaultValue="details">
                <Tabs.List grow>
                    <Tabs.Tab value="details">Details</Tabs.Tab>
                </Tabs.List>
                <Tabs.Panel value="details" py="sm">
                    <ConfigurationFields type={type} />
                </Tabs.Panel>
            </Tabs>
            <Buttons
                cancelButtonProps={cancelButtonProps}
                isSubmitting={isSubmitting}
                onCancel={onCancel}
                submitButtonProps={submitButtonProps}
                view={view}
            />
        </SmartForm>
    );
};