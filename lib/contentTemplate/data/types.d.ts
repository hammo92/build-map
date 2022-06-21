import { FieldType } from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { SelectProps, TextInputProps, CheckboxProps, MultiSelectProps, NumberInputProps } from "@mantine/core";
import { Required } from "utility-types";

export interface ContentTemplateFieldBase<T extends FieldType> {
    id?: string;
    name: string;
    type: T;
    active?: boolean;
    required?: boolean;
    description?: string;
    permissions?: {
        editableBy?: "all" | "issuer" | "recipient";
        visibleTo?: "all" | "issuer" | "recipient";
    };
}

export type ContentTemplateFieldCheckbox = ContentTemplateFieldBase<"checkbox"> & {
    defaultValue?: CheckboxProps["defaultValue"];
    defaultChecked?: CheckboxProps["defaultChecked"];
};

export type ContentTemplateFieldComponent = ContentTemplateFieldBase<"component"> & {
    defaultValue?: any;
};

export type ContentTemplateFieldDate = ContentTemplateFieldBase<"date"> & {
    defaultValue?: any;
};

export type ContentTemplateFieldEmail = ContentTemplateFieldBase<"email"> & {
    defaultValue?: TextInputProps["defaultValue"];
};

export type ContentTemplateFieldImage = ContentTemplateFieldBase<"image"> & {
    defaultValue?: any;
};

export type ContentTemplateFieldMultiSelect = ContentTemplateFieldBase<"multiSelect"> & {
    data?: string[];
    defaultValue?: MultiSelectProps["defaultValue"];
};

export type ContentTemplateFieldNumber = ContentTemplateFieldBase<"number"> & {
    subtype: "integer" | "decimal" | "float";
    defaultValue?: NumberInputProps["defaultValue"];
    min?: NumberInputProps["min"];
    max?: NumberInputProps["max"];
};

export type ContentTemplateFieldRichText = ContentTemplateFieldBase<"richText"> & {
    defaultValue?: any;
};

export type ContentTemplateFieldSelect = ContentTemplateFieldBase<"select"> & {
    data?: string[];
    defaultValue?: SelectProps["defaultValue"];
};

export type ContentTemplateFieldText = ContentTemplateFieldBase<"text"> & {
    subtype: "shortText" | "longText";
    defaultValue?: TextInputProps["defaultValue"];
};

export type ContentTemplateField =
    | ContentTemplateFieldCheckbox
    | ContentTemplateFieldComponent
    | ContentTemplateFieldDate
    | ContentTemplateFieldImage
    | ContentTemplateFieldEmail
    | ContentTemplateFieldMultiSelect
    | ContentTemplateFieldNumber
    | ContentTemplateFieldRichText
    | ContentTemplateFieldSelect
    | ContentTemplateFieldText;

const isTemplateCheckboxField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldCheckbox => {
    field.type === "checkbox";
};
const isTemplateComponentField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldComponent => {
    field.type === "component";
};
const isEmailField = (field: Required<Partial<ContentTemplateField>, "type">): field is ContentTemplateFieldEmail => {
    field.type === "email";
};
const isTemplateImageField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldImage => {
    field.type === "image";
};
const isTemplateMultiSelectField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldMultiSelect => {
    field.type === "multiSelect";
};
const isTemplateNumberField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldNumber => {
    field.type === "number";
};
const isTemplateTextField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldText => {
    field.type === "text";
};
const isTemplateSelectField = (
    field: Required<Partial<ContentTemplateField>, "type">
): field is ContentTemplateFieldSelect => {
    field.type === "select";
};
