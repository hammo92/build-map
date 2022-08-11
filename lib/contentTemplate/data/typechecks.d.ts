import { Required } from "utility-types";
import {
    Property,
    PropertyCheckbox,
    PropertyComponent,
    PropertyEmail,
    PropertyImage,
    PropertyMultiSelect,
    PropertyNumber,
    PropertyRelation,
    PropertySelect,
    PropertyText,
} from "./types";

export const isTemplateCheckboxField = (
    field: Required<Partial<Property>, "type">
): field is PropertyCheckbox => {
    field.type === "checkbox";
};
export const isTemplateComponentField = (
    field: Required<Partial<Property>, "type">
): field is PropertyComponent => {
    field.type === "component";
};
export const isEmailField = (
    field: Required<Partial<Property>, "type">
): field is PropertyEmail => {
    field.type === "email";
};
export const isTemplateImageField = (
    field: Required<Partial<Property>, "type">
): field is PropertyImage => {
    field.type === "image";
};
export const isTemplateMultiSelectField = (
    field: Required<Partial<Property>, "type">
): field is PropertyMultiSelect => {
    field.type === "multiSelect";
};
export const isTemplateNumberField = (
    field: Required<Partial<Property>, "type">
): field is PropertyNumber => {
    field.type === "number";
};
export const isTemplateTextField = (
    field: Required<Partial<Property>, "type">
): field is PropertyText => {
    field.type === "text";
};
export const isTemplateSelectField = (
    field: Required<Partial<Property>, "type">
): field is PropertyMultiSelect => {
    field.type === "select";
};

export const isRelationProperty = (
    field: Required<Partial<Property>, "type">
): field is PropertyRelation => {
    field.type === "relation";
};
