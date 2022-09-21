import { Asset } from "../../asset/data/asset.model";
import {
    PropertyCheckbox,
    PropertyComponent,
    PropertyDate,
    PropertyEmail,
    PropertyImage,
    PropertyMultiSelect,
    PropertyNumber,
    PropertyRelation,
    PropertyRichText,
    PropertySelect,
    PropertyText,
} from "@lib/contentTemplate/data/types";
import { SelectProps, TextInputProps } from "@mantine/core";
import { RichTextEditorProps } from "@mantine/rte";
import { CleanedCamel } from "type-helpers";
import { PropertyGroup } from "../../lib/contentTemplate/data/contentTemplate.model";

export interface FieldBase {
    id: string;
    templateFieldId?: string;
    category: "template" | "additional";
    assets?: string[];
    note?: string[];
    tasks?: string[];
    defaultValue?: any;
}

export interface ContentFieldCheckbox extends PropertyCheckbox, FieldBase {
    value?: boolean;
}
export interface ContentFieldComponent extends PropertyComponent, FieldBase {
    value?: any;
}
export interface ContentFieldDate extends PropertyDate, FieldBase {
    value?: any;
}

export interface ContentFieldEmail extends PropertyEmail, FieldBase {
    value?: string;
}
export interface ContentFieldImage extends PropertyImage, FieldBase {
    value?: string[];
}
export interface ContentFieldMultiSelect extends PropertyMultiSelect, FieldBase {
    value?: string[];
}
export interface ContentFieldNumber extends PropertyNumber, FieldBase {
    value?: number;
}
export interface ContentFieldRichText extends PropertyRichText, FieldBase {
    value?: string;
}

export interface ContentFieldSelect extends PropertySelect, FieldBase {
    value?: string;
}

export interface ContentFieldText extends PropertyText, FieldBase {
    value?: string;
}

export interface ContentFieldRelation extends PropertyRelation, FieldBase {
    value?: string[];
}

type ContentField =
    | ContentFieldCheckbox
    | ContentFieldComponent
    | ContentFieldDate
    | ContentFieldEmail
    | ContentFieldImage
    | ContentFieldMultiSelect
    | ContentFieldNumber
    | ContentFieldRichText
    | ContentFieldText
    | ContentFieldSelect
    | ContentFieldRelation;

/*type ContentFieldBase = {
    id: string;
    templateFieldId: string;
};

export type ContentFieldCheckbox = PropertyCheckbox& ContentFieldBase & {
    value?: boolean;
}
export type ContentFieldComponent = PropertyComponent& ContentFieldBase & {
    value?: any;
}
export type ContentFieldDate = PropertyDate& ContentFieldBase & {
    value?: any;
}

export type ContentFieldEmail = PropertyEmail& ContentFieldBase & {
    value?: string;
}
export type ContentFieldImage = PropertyImage& ContentFieldBase & {
    value?: any;
}
export type ContentFieldMultiSelect = PropertyMultiSelect& ContentFieldBase & {
    value?: string[];
    data: string;
}
export type ContentFieldNumber = PropertyNumber& ContentFieldBase & {
    value?: number;
}
export type ContentFieldRichText = PropertyRichText& ContentFieldBase & {
    value?: string;
}

export type ContentFieldSelect = PropertySelect& ContentFieldBase & {
    value?: string;
    data: string;
}

export type ContentFieldText = PropertyText& ContentFieldBase & {
    value?: string;
}*/
