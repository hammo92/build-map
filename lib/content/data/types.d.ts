import { Asset } from "../../asset/data/asset.model";
import {
    ContentTemplateFieldCheckbox,
    ContentTemplateFieldComponent,
    ContentTemplateFieldDate,
    ContentTemplateFieldEmail,
    ContentTemplateFieldImage,
    ContentTemplateFieldMultiSelect,
    ContentTemplateFieldNumber,
    ContentTemplateFieldRichText,
    ContentTemplateFieldSelect,
    ContentTemplateFieldText,
} from "@lib/contentTemplate/data/types";
import { SelectProps, TextInputProps } from "@mantine/core";
import { RichTextEditorProps } from "@mantine/rte";
import { CleanedCamel } from "type-helpers";

export interface ContentFieldCheckbox extends ContentTemplateFieldCheckbox {
    id: string;
    templateFieldId: string;
    value?: boolean;
}
export interface ContentFieldComponent extends ContentTemplateFieldComponent {
    id: string;
    templateFieldId: string;
    value?: any;
}
export interface ContentFieldDate extends ContentTemplateFieldDate {
    id: string;
    templateFieldId: string;
    value?: any;
}

export interface ContentFieldEmail extends ContentTemplateFieldEmail {
    id: string;
    templateFieldId: string;
    value?: string;
}
export interface ContentFieldImage extends ContentTemplateFieldImage {
    id: string;
    templateFieldId: string;
    value?: string[];
}
export interface ContentFieldMultiSelect extends ContentTemplateFieldMultiSelect {
    id: string;
    templateFieldId: string;
    value?: string[];
    data: string;
}
export interface ContentFieldNumber extends ContentTemplateFieldNumber {
    id: string;
    templateFieldId: string;
    value?: number;
}
export interface ContentFieldRichText extends ContentTemplateFieldRichText {
    id: string;
    templateFieldId: string;
    value?: string;
}

export interface ContentFieldSelect extends ContentTemplateFieldSelect {
    id: string;
    templateFieldId: string;
    value?: string;
    data: string;
}

export interface ContentFieldText extends ContentTemplateFieldText {
    id: string;
    templateFieldId: string;
    value?: string;
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
    | ContentFieldSelect;

/*type ContentFieldBase = {
    id: string;
    templateFieldId: string;
};

export type ContentFieldCheckbox = ContentTemplateFieldCheckbox& ContentFieldBase & {
    value?: boolean;
}
export type ContentFieldComponent = ContentTemplateFieldComponent& ContentFieldBase & {
    value?: any;
}
export type ContentFieldDate = ContentTemplateFieldDate& ContentFieldBase & {
    value?: any;
}

export type ContentFieldEmail = ContentTemplateFieldEmail& ContentFieldBase & {
    value?: string;
}
export type ContentFieldImage = ContentTemplateFieldImage& ContentFieldBase & {
    value?: any;
}
export type ContentFieldMultiSelect = ContentTemplateFieldMultiSelect& ContentFieldBase & {
    value?: string[];
    data: string;
}
export type ContentFieldNumber = ContentTemplateFieldNumber& ContentFieldBase & {
    value?: number;
}
export type ContentFieldRichText = ContentTemplateFieldRichText& ContentFieldBase & {
    value?: string;
}

export type ContentFieldSelect = ContentTemplateFieldSelect& ContentFieldBase & {
    value?: string;
    data: string;
}

export type ContentFieldText = ContentTemplateFieldText& ContentFieldBase & {
    value?: string;
}*/
