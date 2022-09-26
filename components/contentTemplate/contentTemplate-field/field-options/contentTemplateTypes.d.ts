import { FieldType } from "./fieldsDefinitions";

interface variant<T> {
    type: string;
    description: string;
    label: string;
}

interface FieldTypePropsBase {
    type: FieldType;
    description: string;
    label: string;
    icon: FontAwesomeIconProps["icon"];
    variants?: variant[];
}

export interface FieldTypePropsSelect extends FieldTypePropsBase {
    type: "select";
    variants: [variant<"single">, variant<"multiple">];
}

export interface FieldTypePropsNumber extends FieldTypePropsBase {
    type: "number";
    variants: [variant<"integer">, variant<"decimal">, variant<"float">];
}

export interface FieldTypePropsText extends FieldTypePropsBase {
    type: "text";
    variants: [variant<"shortText">, variant<"longText">];
}

export interface FieldTypePropsImage extends FieldTypePropsBase {
    type: "image";
    variants: [variant<"single">, variant<"multiple">];
}

export interface FieldTypePropsDate extends FieldTypePropsBase {
    type: "date";
    variants: [variant<"date">, variant<"dateTime">, variant<"time">];
}

export type FieldTypeProps =
    | FieldTypePropsBase
    | FieldTypePropsSelect
    | FieldTypePropsNumber
    | FieldTypePropsText
    | FieldTypePropsImage
    | FieldTypePropsDate;
