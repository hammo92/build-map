import { FieldType } from "./fieldsDefinitions";

interface Subtype<T> {
    type: T;
    description: string;
    label: string;
}

interface FieldTypePropsBase {
    type: FieldType;
    description: string;
    label: string;
    icon: FontAwesomeIconProps["icon"];
    subtypes?: Subtype[];
}

export interface FieldTypePropsSelect extends FieldTypePropsBase {
    type: "select";
    subtypes: [Subtype<"single">, Subtype<"multiple">];
}

export interface FieldTypePropsNumber extends FieldTypePropsBase {
    type: "number";
    subtypes: [Subtype<"integer">, Subtype<"decimal">, Subtype<"float">];
}

export interface FieldTypePropsText extends FieldTypePropsBase {
    type: "text";
    subtypes: [Subtype<"shortText">, Subtype<"longText">];
}

export interface FieldTypePropsImage extends FieldTypePropsBase {
    type: "image";
    subtypes: [Subtype<"single">, Subtype<"multiple">];
}

export interface FieldTypePropsDate extends FieldTypePropsBase {
    type: "date";
    subtypes: [Subtype<"date">, Subtype<"dateTime">, Subtype<"time">];
}

export type FieldTypeProps =
    | FieldTypePropsBase
    | FieldTypePropsSelect
    | FieldTypePropsNumber
    | FieldTypePropsText
    | FieldTypePropsImage
    | FieldTypePropsDate;
