interface Subtype<t> {
    type: t;
    description: string;
    label: string;
}

interface FieldTypePropsBase {
    type: string;
    description: string;
    label: string;
    icon: FontAwesomeIconProps["icon"];
    config?: {
        subtype?: Subtype[];
        options?: string[];
    };
}

export interface FieldTypePropsSelect extends FieldTypePropsBase {
    type: "select";
    config: {
        subtype: [Subtype<"single">, Subtype<"multiple">];
        options: string[];
        defaultOption: string;
    };
}

export interface FieldTypePropsNumber extends FieldTypePropsBase {
    type: "number";
    config: {
        subtype: [Subtype<"integer">, Subtype<"decimal">, Subtype<"float">];
    };
}

export interface FieldTypePropsText extends FieldTypePropsBase {
    type: "text";
    config: {
        subtype: [Subtype<"shortText">, Subtype<"longText">];
    };
}

export interface FieldTypePropsImage extends FieldTypePropsBase {
    type: "image";
    config: {
        subtype: [Subtype<"single">, Subtype<"multiple">];
    };
}

export interface FieldTypePropsDate extends FieldTypePropsBase {
    type: "date";
    config: {
        subtype: [Subtype<"date">, Subtype<"dateTime">, Subtype<"time">];
    };
}

export type FieldTypeProps =
    | FieldTypePropsBase
    | FieldTypePropsSelect
    | FieldTypePropsNumber
    | FieldTypePropsText
    | FieldTypePropsImage
    | FieldTypePropsDate;
