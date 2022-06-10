import { text } from "@fortawesome/fontawesome-svg-core";
import { Textarea, TextInput } from "@mantine/core";
import React, { FC } from "react";
import { TextFieldProps } from "./fieldsTextProps";

interface FieldsTextProps {
    textField: TextFieldProps;
}

export const FieldsText: FC<FieldsTextProps> = ({ textField }) => {
    const { subtype } = textField.config;
    if (subtype === "shortText")
        return (
            <TextInput label={textField.name} defaultValue={textField.value} />
        );
    if (subtype === "longText")
        return (
            <Textarea label={textField.name} defaultValue={textField.value} />
        );
    return null;
};
