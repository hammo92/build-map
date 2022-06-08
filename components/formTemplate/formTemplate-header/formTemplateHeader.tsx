import { Group } from "@mantine/core";
import React from "react";
import { FormTemplateDelete } from "../formTemplate-delete";
import { FormTemplateStatus } from "../formTemplate-status";
import { FormTemplateTitle } from "../formTemplate-title";

export const FormTemplateHeader = () => {
    return (
        <Group position="apart" noWrap>
            <FormTemplateTitle editable />
            <Group noWrap sx={{ flexShrink: 0 }}>
                <FormTemplateStatus />
                <FormTemplateDelete />
            </Group>
        </Group>
    );
};
