import {
    Checkbox,
    Grid,
    Group,
    SegmentedControl,
    Select,
    Switch,
    Text,
} from "@mantine/core";
import { contentTypeState } from "@state/contentType";
import React from "react";
import { capitalise } from "utils/stringTransform";
import { useSnapshot } from "valtio";

export const AdvancedFieldsBoolean = () => {
    const { fieldDetails, updateFieldConfig } = useSnapshot(contentTypeState);
    return (
        <Grid.Col span={12}>
            <Group direction="column" grow spacing="sm">
                <Text size="sm">Default Value</Text>

                <SegmentedControl
                    defaultValue={fieldDetails?.config?.defaultValue ?? "false"}
                    fullWidth
                    data={[
                        { label: "True", value: "true" },
                        { label: "False", value: "false" },
                    ]}
                    onChange={(value: "true" | "false") =>
                        updateFieldConfig({ defaultValue: value })
                    }
                />
            </Group>
        </Grid.Col>
    );
};
