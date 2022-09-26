/* Field.model.ts */

import { BaseModel } from "@lib/models";
import { buildIndex, indexBy } from "serverless-cloud-data-utils";
import { DistributiveClean, StripModel } from "type-helpers";

export interface FieldTitle {
    setType: "manual" | "auto";
    type: "contentInfo" | "contentProperty";
    value: string;
}

export interface PropertyGroup {
    type: "propertyGroup";
    id: string | number;
    children: (string | number)[];
    name: string;
    repeatable: boolean;
}

//* Field model and indexes //

// To get all Field by it's ID *//
//namespace Field:${FieldId} */
export const FieldId = buildIndex({ namespace: `Field`, label: "label1" });

abstract class BaseField extends BaseModel<BaseField> {
    readonly object = "Field";
    abstract readonly type: string;
    archived = false;
    required?: boolean;
    active?: boolean;
    description?: string;
    note?: string;
    assets?: string[];
    modelKeys() {
        return [indexBy(FieldId).exact(this.id)];
    }
}

export class CheckboxField extends BaseField {
    readonly type: "checkbox";
    value?: boolean;
    defaultValue?: boolean;
    constructor(obj?: any) {
        super(obj);
        this.type = "checkbox";
    }
}

export class DateField extends BaseField {
    readonly type: "date";
    value?: string;
    defaultValue?: string;

    constructor(obj?: any) {
        super(obj);
        this.type = "date";
    }
}

export class EmailField extends BaseField {
    readonly type: "email";
    value?: string;
    defaultValue?: string;
    constructor(obj?: any) {
        super(obj);
        this.type = "email";
    }
}

export class ImageField extends BaseField {
    readonly type: "image";
    variant: "single" | "multiple";
    value?: string[];
    defaultValue?: string[];
    constructor(obj?: any) {
        super(obj);
        this.type = "image";
    }
}

export class MultiSelectField extends BaseField {
    readonly type: "multiSelect";
    value?: string[];
    defaultValue?: string[];
    constructor(obj?: any) {
        super(obj);
        this.type = "multiSelect";
    }
}

export class NumberField extends BaseField {
    readonly type: "number";
    value?: number;
    defaultValue?: number;
    minimumValue?: number;
    maximumValue?: number;
    variant: "integer" | "decimal" | "float";
    constructor(obj?: any) {
        super(obj);
        this.type = "number";
    }
}

export class RichTextField extends BaseField {
    readonly type: "richText";
    value?: number;
    defaultValue?: number;
    constructor(obj?: any) {
        super(obj);
        this.type = "richText";
    }
}

export class SelectField extends BaseField {
    readonly type: "select";
    value?: string[];
    defaultValue?: string[];
    data: string;
    constructor(obj?: any) {
        super(obj);
        this.type = "select";
    }
}

export class TextField extends BaseField {
    readonly type: "text";
    value?: string;
    defaultValue?: string;
    variant: "shortText" | "longText";
    constructor(obj?: any) {
        super(obj);
        this.type = "text";
    }
}

export class RelationField extends BaseField {
    readonly type: "relation";
    value?: string;
    defaultValue?: never;
    relatedTo: string;
    isReciprocal?: boolean;
    reciprocalPropertyId?: string;
    reciprocalPropertyName?: string;
    constructor(obj?: any) {
        super(obj);
        this.type = "relation";
    }
}

const Field = new NumberField();

export type Field =
    | CheckboxField
    | DateField
    | EmailField
    | ImageField
    | MultiSelectField
    | NumberField
    | RichTextField
    | SelectField
    | TextField
    | RelationField;

export type FieldTypes = Field["type"];

export type FieldDiscriminator<T extends FieldTypes = "checkbox"> = Extract<Field, { type: T }>;

export type Property<T extends FieldTypes | undefined = undefined> = T extends FieldTypes
    ? StripModel<FieldDiscriminator<T>, "value" | "note" | "assets">
    : DistributiveClean<Field, "value" | "note" | "assets">;
