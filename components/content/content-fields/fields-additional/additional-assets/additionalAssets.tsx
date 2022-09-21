import { FIELD_SUFFIXES } from "@components/content/content";
import { SmartForm } from "@components/smartForm";
import { ContentField } from "@lib/content/data/types";
import { Text, Textarea, TextInput } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import React from "react";
import { useFormContext } from "react-hook-form";

export const AdditionalAssets = ({ field }: { field: ContentField }) => {
    const { watch } = useFormContext();
    const value = watch(`${field.id}${FIELD_SUFFIXES.ASSETS}`);
    return (
        <SmartForm.Assets
            name={`${field.id}${FIELD_SUFFIXES.ASSETS}`}
            label="Assets"
            hidden={value === null || value === undefined}
            multiple
            size="sm"
        />
    );
};
