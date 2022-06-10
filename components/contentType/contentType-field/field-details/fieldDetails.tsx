import { Grid, Group, SegmentedControl, Tabs, Text } from "@mantine/core";
import React, { FC } from "react";
import { DetailsAdvancedFields } from "./details-advancedFields";
import { DetailsBasicFields } from "./details-basicFields";
import { BasicFieldsCommon } from "./details-basicFields/basicFields-common";

export const FieldDetails: FC = () => {
    return (
        <Group direction="column" grow>
            <Tabs grow>
                <Tabs.Tab label="Details">
                    <DetailsBasicFields />
                </Tabs.Tab>
                <Tabs.Tab label="Advanced">
                    <DetailsAdvancedFields />
                </Tabs.Tab>
            </Tabs>
        </Group>
    );
};
