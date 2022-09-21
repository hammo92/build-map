import { FIELD_SUFFIXES } from "@components/content/content";
import { SmartForm } from "@components/smartForm";
import { ContentField } from "@lib/content/data/types";
import { Text, Textarea, TextInput } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import React from "react";
import { useFormContext } from "react-hook-form";

export const AdditionalNote = ({ field }: { field: ContentField }) => {
    const { watch, getValues } = useFormContext();
    const value = watch(`${field.id}${FIELD_SUFFIXES.NOTE}`);
    return (
        <SmartForm.Textarea
            name={`${field.id}${FIELD_SUFFIXES.NOTE}`}
            label="Note"
            hidden={value === null || value === undefined}
        />
    );
};
