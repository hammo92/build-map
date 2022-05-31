import { Grid, Group, SegmentedControl, Tabs, Text } from "@mantine/core";
import React, { FC } from "react";
import { BaseFields } from "./baseFields";

export const FormTemplateFieldDetails: FC = () => {
    return (
        <Group direction="column" grow>
            <Tabs grow>
                <Tabs.Tab label="Details">
                    <Grid gutter="sm">
                        <BaseFields />
                    </Grid>
                </Tabs.Tab>
                <Tabs.Tab label="Advanced">
                    <Group direction="column" grow py="md">
                        <Group position="apart">
                            <Text>Visible To</Text>

                            <SegmentedControl
                                defaultValue="both"
                                data={[
                                    { label: "Creator", value: "creator" },
                                    { label: "Recipient", value: "recipient" },
                                    { label: "Both", value: "both" },
                                ]}
                            />
                        </Group>
                        <Group position="apart">
                            <Text>Editable by</Text>

                            <SegmentedControl
                                defaultValue="both"
                                data={[
                                    { label: "Creator", value: "creator" },
                                    { label: "Recipient", value: "recipient" },
                                    { label: "Both", value: "both" },
                                ]}
                            />
                        </Group>
                    </Group>
                </Tabs.Tab>
            </Tabs>
        </Group>
    );
};
