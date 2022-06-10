import { FIELD_TYPES } from "@components/contentType/constants";
import { Grid, Select, Textarea, TextInput } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React, { useEffect } from "react";
import { useSnapshot } from "valtio";

export const BasicFieldsCommon = () => {
    const { fieldDetails, updateFieldDetails, updateFieldConfig } =
        useSnapshot(contentTypeState);
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
                        value={fieldDetails.name ?? ""}
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
                                    updateFieldConfig({
                                        subtype: value,
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
