/* Property.model.ts */

import { BaseModel } from "@lib/models";
import { buildIndex, indexBy, SecondaryExact, timekey } from "serverless-cloud-data-utils";
import { Icon } from "../../../components/ui/iconPicker/types";

export interface PropertyTitle {
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

//* Property model and indexes //

// To get all Property by it's ID *//
//namespace Property:${PropertyId} */
export const PropertyId = buildIndex({ namespace: `Property`, label: "label1" });

type BaseProperty<T extends string> = BaseModel<BaseProperty<T>> & {
    object: "property";
    type?: T;
    required: boolean;
};

export class CheckboxProperty extends BaseProperty<"checkbox"> {
    defaultValue?: boolean;
}

export class ComponentProperty extends BaseProperty<"component"> {
    defaultValue?: any;
}

export class DateProperty extends BaseProperty<"date"> {
    variant: "dateTime" | "date" | "time";
    defaultValue?: string;
}

export class EmailProperty extends BaseProperty<"email"> {
    defaultValue?: string;
}

export class ImageProperty extends BaseProperty<"image"> {
    variant: "single" | "multiple";
    defaultValue?: any;
}

export class MultiSelectProperty extends BaseProperty<"multiSelect"> {
    defaultValue?: string[];
    data?: string;
}

export class NumberProperty extends BaseProperty<"number"> {
    variant: "integer" | "decimal" | "float";
    defaultValue?: number;
    minimumValue?: number;
    maximumValue?: number;
}

export class SelectProperty extends BaseProperty<"select"> {
    defaultValue?: string[];
    data?: string;
}

export class TextProperty extends BaseProperty<"text"> {
    variant: "shortText" | "longText";
    defaultValue?: string;
}

export class RelationProperty extends BaseProperty<"text"> {
    defaultValue?: never;

    // id of related template
    relatedTo: string;

    isReciprocal?: boolean;

    // id of property on related template
    reciprocalPropertyId?: string;

    reciprocalPropertyName?: string;
}

export type Properties =
    | CheckboxProperty
    | ComponentProperty
    | DateProperty
    | EmailProperty
    | ImageProperty
    | MultiSelectProperty
    | NumberProperty
    | SelectProperty
    | TextProperty
    | RelationProperty;

export type PropertyTypes = Properties["type"];

export type PropertyDiscriminator<T extends PropertyTypes> = Extract<Properties, { type: T }>;
