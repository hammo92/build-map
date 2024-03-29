import { Field } from "../../../lib/field/data/field.model";
import {
    SelectProps,
    TextInputProps,
    CheckboxProps,
    MultiSelectProps,
    NumberInputProps,
} from "@mantine/core";
import { DistributiveOmit } from "type-helpers";
import { Required } from "utility-types";

export interface PropertyBase<T extends FieldType> {
    id: string;
    name: string;
    type: T;
    active?: boolean;
    required?: boolean;
    description?: string;
    permissions?: {
        editableBy?: "all" | "issuer" | "recipient";
        visibleTo?: "all" | "issuer" | "recipient";
    };
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
}

export type PropertyCheckbox = PropertyBase<"checkbox"> & {
    defaultValue?: boolean;
};

export type PropertyComponent = PropertyBase<"component"> & {
    defaultValue?: any;
};

export type PropertyDate = PropertyBase<"date"> & {
    variant: "dateTime" | "date" | "time";
    defaultValue?: any;
};

export type PropertyEmail = PropertyBase<"email"> & {
    defaultValue?: string;
};

export type PropertyImage = PropertyBase<"image"> & {
    variant: "single" | "multiple";
    defaultValue?: any;
};

export type PropertyMultiSelect = PropertyBase<"multiSelect"> & {
    defaultValue?: string[];
    data?: string;
};

export type PropertyNumber = PropertyBase<"number"> & {
    variant: "integer" | "decimal" | "float";
    defaultValue?: number;
    min?: NumberInputProps["min"];
    max?: NumberInputProps["max"];
};

export type PropertyRichText = PropertyBase<"richText"> & {
    defaultValue?: any;
};

export type PropertySelect = PropertyBase<"select"> & {
    defaultValue?: string;
    data?: string;
};

export type PropertyText = PropertyBase<"text"> & {
    variant: "shortText" | "longText";
    defaultValue?: string;
};

export type PropertyRelation = PropertyBase<"relation"> & {
    defaultValue?: never;

    // id of related template
    relatedTo: string;

    isReciprocal?: boolean;

    // id of property on related template
    reciprocalPropertyId?: string;

    reciprocalPropertyName?: string;
};

export const isRelationProperty = (
    field: Required<Partial<Property>, "type">
): field is PropertyRelation => {
    field.type === "relation";
};
