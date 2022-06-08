import { Grid, Select } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React from "react";
import { capitalise } from "utils/stringTransform";
import { useSnapshot } from "valtio";

export const AdvancedFieldsSelect = () => {
    const { fieldDetails, updateFieldDetails } = useSnapshot(formTemplateState);
    const options = fieldDetails?.config?.options;
    const disabled = !options || options.length < 1;
    return (
        <Grid.Col span={12}>
            <Select
                label="Default value"
                value={fieldDetails?.config?.defaultOption}
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
                            defaultOption: value,
                        },
                    })
                }
            />
        </Grid.Col>
    );
};
