import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group } from "@mantine/core";
import React, { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { ContentTemplateDelete } from "../contentTemplate-delete";
import { FieldCreate } from "../contentTemplate-field/field-create";
import { ContentTemplateIcon } from "../contentTemplate-icon";
import { ContentTemplateStatus } from "../contentTemplate-status";
import { ContentTemplateTitle } from "../contentTemplate-title";

export const ContentTemplateHeader: FC<{ contentTemplate: CleanedCamel<ContentTemplate> }> = ({
    contentTemplate,
}) => {
    return (
        <Group position="apart" noWrap>
            <Group noWrap>
                <ContentTemplateIcon
                    key={contentTemplate.id}
                    editable
                    contentTemplate={contentTemplate}
                />
                <ContentTemplateTitle editable contentTemplate={contentTemplate} />
            </Group>

            <Group noWrap sx={{ flexShrink: 0 }} spacing="sm">
                <ContentTemplateStatus contentTemplate={contentTemplate} />
                <ContentTemplateDelete contentTemplate={contentTemplate} />
                <FieldCreate variant="icon" contentTemplate={contentTemplate} />
            </Group>
        </Group>
    );
};
