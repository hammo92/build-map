import { Field, FieldType } from "@lib/field/data/field.model";
import React from "react";
import { CleanedCamel } from "type-helpers";

export type FieldProps<T extends FieldType> = {
    field: CleanedCamel<Field<T>>;
    rightContent?: React.ReactElement;
};
