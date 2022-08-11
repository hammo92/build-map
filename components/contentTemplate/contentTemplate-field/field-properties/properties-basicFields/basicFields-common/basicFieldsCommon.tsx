import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { SmartForm } from "@components/smartForm";
import { FC } from "react";

export const BasicFieldsCommon: FC<{ type: FieldType }> = ({ type }) => {
    const subtypes = FIELD_TYPES[type]?.subtypes;
    return (
        <>
            <SmartForm.FieldGroup cols={subtypes?.length ? 2 : 1}>
                <SmartForm.TextInput
                    name="name"
                    required
                    label="Property Name"
                    rules={{ minLength: 2 }}
                />
                {
                    // If field option has subtypes
                    subtypes?.length ? (
                        <SmartForm.Select
                            required
                            label="Variant"
                            name="subtype"
                            data={subtypes?.map((subtype) => ({
                                ...subtype,
                                value: subtype.type,
                            }))}
                        />
                    ) : null
                }
            </SmartForm.FieldGroup>
        </>
    );
};
