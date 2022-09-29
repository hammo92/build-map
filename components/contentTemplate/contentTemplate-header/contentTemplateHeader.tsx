import { useUpdateContentTemplateProperties } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Button, Group } from "@mantine/core";
import { propertyManager } from "@state/propertyManager";
import React, { FC } from "react";
import { CleanedCamel } from "type-helpers";
import { useSnapshot } from "valtio";
import { ContentTemplateDelete } from "../contentTemplate-delete";
import { ContentTemplateIcon } from "../contentTemplate-icon";
import { ContentTemplateStatus } from "../contentTemplate-status";
import { ContentTemplateTitle } from "../contentTemplate-title";

export const ContentTemplateHeader: FC<{ contentTemplate: CleanedCamel<ContentTemplate> }> = ({
    contentTemplate,
}) => {
    const {
        changed,
        createdGroups,
        createdProperties,
        deletedGroups,
        deletedProperties,
        updatedGroups,
        updatedProperties,
    } = useSnapshot(propertyManager);
    const { mutateAsync, isLoading } = useUpdateContentTemplateProperties();
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
                <Button
                    disabled={!changed || isLoading}
                    loading={isLoading}
                    onClick={async () => {
                        mutateAsync({
                            contentTemplateId: contentTemplate.id,
                            createdGroups,
                            createdProperties,
                            deletedGroups,
                            deletedProperties,
                            updatedGroups,
                            updatedProperties,
                        });
                    }}
                >
                    Save
                </Button>
                <ContentTemplateDelete contentTemplate={contentTemplate} />
            </Group>
        </Group>
    );
};
