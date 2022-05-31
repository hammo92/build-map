import { FIELD_TYPES } from "@components/formTemplate/constants";
import { Grid, Select, Textarea, TextInput } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React from "react";
import { useSnapshot } from "valtio";

export const BaseFields = () => {
    const { fieldDetails, updateFieldDetails } = useSnapshot(formTemplateState);
    const { type } = fieldDetails;
    if (type) {
        const subtypes = FIELD_TYPES[type]?.config?.subtype;
        return (
            <>
                <Grid.Col
                    // If field option has subtypes
                    span={subtypes?.length ? 6 : 12}
                >
                    <TextInput
                        placeholder="Field Name"
                        required
                        label="Field Name"
                        value={fieldDetails.name}
                        onChange={(event) =>
                            updateFieldDetails({
                                name: event.currentTarget.value,
                            })
                        }
                    />
                </Grid.Col>
                {subtypes?.length ? (
                    <Grid.Col
                        // If field option has subtypes
                        span={6}
                    >
                        <Select
                            required
                            label="Variant"
                            data={subtypes?.map((subtype) => ({
                                ...subtype,
                                value: subtype.type,
                            }))}
                            value={fieldDetails?.config?.subtype}
                            onChange={(value) => {
                                value &&
                                    updateFieldDetails({
                                        config: { subtype: value },
                                    });
                            }}
                        />
                    </Grid.Col>
                ) : null}

                <Grid.Col span={12}>
                    <Textarea
                        placeholder="A helpful tip about the field"
                        label="Description"
                        defaultValue={fieldDetails?.description}
                        onChange={(event) =>
                            updateFieldDetails({
                                description: event.currentTarget.value,
                            })
                        }
                    />
                </Grid.Col>
            </>
        );
    }
    return null;
};
