import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
import { SmartForm } from "@components/smartForm";
import { FC } from "react";

export const BasicFieldsCommon: FC<{ type: FieldType; options: Record<string, any> }> = ({
    type,
    options,
}) => {
    const variants = FIELD_TYPES[type]?.variants;
    return (
        <>
            <SmartForm.FieldGroup cols={variants?.length ? 2 : 1}>
                <SmartForm.TextInput
                    name="name"
                    required
                    label="Property Name"
                    rules={{ minLength: 2 }}
                />
                {
                    // If field option has variants
                    variants?.length ? (
                        <SmartForm.Select
                            required
                            label="Variant"
                            name="variant"
                            data={variants?.map((variant) => ({
                                ...variant,
                                value: variant.type,
                            }))}
                            disabled={options?.variantLocked}
                        />
                    ) : null
                }
            </SmartForm.FieldGroup>
        </>
    );
};
