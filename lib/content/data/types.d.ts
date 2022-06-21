import {
    ContentTemplateFieldSelect,
    ContentTemplateFieldText,
} from "@lib/contentTemplate/data/types";
import { SelectProps, TextInputProps } from "@mantine/core";

export interface ContentText extends ContentTemplateFieldText {
    id: string;
    value: TextInputProps["value"];
}

export interface ContentSelect extends ContentTemplateFieldSelect {
    id: string;
    value: SelectProps["value"];
}

type ContentField = ContentText | ContentSelect;
