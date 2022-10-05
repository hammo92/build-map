import { ulid } from "ulid";
import { ContentField } from "../types";
/*import {
    ContentTemplateHistory,
    ContentTemplate as ContentTemplateModel,
} from "../../../lib/contentTemplate/data/contentTemplate.model";*/

import structuredClone from "@ungap/structured-clone";
import { Field, FieldType, Property } from "../../../field/data/field.model";

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

export function fieldFromTemplateProperty<T extends FieldType>({
    property,
    type,
    userId,
    overrides,
    parent,
}: {
    property: Property<T>;
    type: T;
    userId: string;
    date: string;
    overrides?: Partial<Field>;
    parent: string;
}): Field<T> {
    const { id, createdBy, createdTime, lastEditedBy, lastEditedTime, active, archived, ...rest } =
        property;

    const newField = new Field<T>({
        ...rest,
        type,
        ...(property.defaultValue && {
            value: property?.defaultValue,
            defaultValue: property.defaultValue,
        }),
        templatePropertyId: property.id,
        parent,
        userId,
        ...overrides,
    });
    return newField;
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
