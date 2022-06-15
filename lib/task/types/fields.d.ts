export interface FieldBase {
    id: string;
    title: string;
    value?: string;
    active?: boolean;
    description?: string;
}

export interface NumberField extends FieldBase {
    type: "number";
}

export interface TextField extends FieldBase {
    type: "text";
}

export interface SelectField extends FieldBase {
    type: "enum";
    options?: { value: string; color?: string }[];
}

export type TaskField = NumberField | TextField | SelectField;
