import { Grid, Group, SegmentedControl, Text } from "@mantine/core";
import { formTemplateState } from "@state/formTemplate";
import React, { useEffect, useState } from "react";
import { useSnapshot } from "valtio";

export const AdvancedFieldsCommon = () => {
    const { fieldDetails, updateFieldConfig } = useSnapshot(formTemplateState);
    return (
        <Grid.Col span={12}>
            <Group direction="column" grow>
                <Group direction="column" grow spacing="sm">
                    <Text size="sm">Visible To</Text>

                    <SegmentedControl
                        value={fieldDetails?.config?.visibleTo ?? "all"}
                        fullWidth
                        data={[
                            { label: "Issuer", value: "issuer" },
                            { label: "Recipient", value: "recipient" },
                            { label: "Both", value: "all" },
                        ]}
                        onChange={(value: "issuer" | "recipient" | "all") => {
                            if (["issuer", "recipient"].includes(value)) {
                                updateFieldConfig({ visibleTo: value });
                                updateFieldConfig({ editableBy: value });
                            } else {
                                updateFieldConfig({ visibleTo: value });
                            }
                        }}
                    />
                </Group>
                <Group direction="column" grow spacing="sm">
                    <Text size="sm">Editable by</Text>

                    <SegmentedControl
                        value={fieldDetails?.config?.editableBy ?? "all"}
                        fullWidth
                        disabled={
                            fieldDetails?.config?.visibleTo &&
                            ["issuer", "recipient"].includes(
                                fieldDetails?.config?.visibleTo
                            )
                        }
                        data={[
                            { label: "Issuer", value: "issuer" },
                            { label: "Recipient", value: "recipient" },
                            { label: "Both", value: "all" },
                        ]}
                        onChange={(value: "issuer" | "recipient" | "all") =>
                            updateFieldConfig({ editableBy: value })
                        }
                    />
                </Group>
            </Group>
        </Grid.Col>
    );
};
