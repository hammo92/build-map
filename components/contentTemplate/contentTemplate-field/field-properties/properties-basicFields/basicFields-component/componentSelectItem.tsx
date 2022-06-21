import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Group, Text, ThemeIcon } from "@mantine/core";
import React, { forwardRef } from "react";

interface SelectComponent extends React.ComponentPropsWithoutRef<"div"> {
    label: string;
    value: string;
    icon: ContentTemplate["icon"];
}

export const ComponentSelectItem = forwardRef<HTMLDivElement, SelectComponent>(
    ({ icon, label, ...rest }: SelectComponent, ref) => (
        <div ref={ref} {...rest}>
            <Group noWrap p="sm">
                <ThemeIcon color={icon.color}>
                    <FontAwesomeIcon icon={icon.icon} />
                </ThemeIcon>

                <div>
                    <Text size="sm">{label}</Text>
                </div>
            </Group>
        </div>
    )
);
ComponentSelectItem.displayName = "SelectItem";
