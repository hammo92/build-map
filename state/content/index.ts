import { ContentTemplateField } from "@lib/contentTemplate/data/contentTemplate.model";
import { proxy } from "valtio";

export const contentState = proxy<{
    contentId: string;
    fieldProperties: Partial<ContentTemplateField>;
}>({
    contentId: "",
    fieldProperties: {},
});
