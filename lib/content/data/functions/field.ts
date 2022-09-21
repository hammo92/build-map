import { ulid } from "ulid";
import { ContentField } from "../types";
/*import {
    ContentTemplateHistory,
    ContentTemplate as ContentTemplateModel,
} from "../../../lib/contentTemplate/data/contentTemplate.model";*/

import structuredClone from "@ungap/structured-clone";
import { Property } from "../../../contentTemplate/data/types";

export function fieldBaseValues({
    userId,
    date,
}: {
    userId: string;
    date: string;
}): Partial<ContentField> {
    return {
        id: ulid(),
        active: true,
        createdBy: userId,
        createdTime: date,
        lastEditedTime: date,
        lastEditedBy: userId,
    };
}

export function fieldFromTemplateProperty({
    property,
    userId,
    date,
    overrides,
}: {
    property: Property;
    userId: string;
    date: string;
    overrides?: Partial<ContentField>;
}): ContentField {
    return {
        ...property,
        ...(property.defaultValue && {
            value: property?.defaultValue,
            defaultValue: property.defaultValue,
        }),
        ...fieldBaseValues({ userId, date }),
        category: "template",
        templateFieldId: property.id,
        ...overrides,
    };
}

export function duplicateField({
    field,
    userId,
    keepValue,
}: {
    field: ContentField;
    userId: string;
    keepValue?: boolean;
}) {
    const copy = structuredClone(field);
    const date = new Date().toISOString();
    copy.id = ulid();
    copy.createdBy = userId;
    copy.createdTime = date;
    copy.lastEditedTime = date;
    copy.lastEditedBy = userId;
    if (!keepValue && !copy.defaultValue) {
        delete copy.value;
    }
    if (copy.defaultValue) {
        copy.value = copy.defaultValue;
    }
    return copy;
}
