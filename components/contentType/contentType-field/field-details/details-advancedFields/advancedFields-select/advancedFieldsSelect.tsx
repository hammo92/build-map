import { Grid, Select } from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { useSnapshot } from "valtio";

export const AdvancedFieldsSelect = () => {
    const { fieldDetails, updateFieldDetails } = useSnapshot(contentTypeState);
    const options = fieldDetails?.config?.options;
    const disabled = !options || options.length < 1;
    return (
        <Grid.Col span={12}>
            <Select
                label="Default value"
                value={fieldDetails?.config?.defaultSelected}
                data={options ?? []}
                disabled={disabled}
                description={
                    disabled &&
                    "No options have been added yet, add options first."
                }
                onChange={(value) =>
                    updateFieldDetails({
                        config: {
                            ...fieldDetails.config,
                            defaultSelected: value,
                        },
                    })
                }
            />
        </Grid.Col>
    );
};
