import {
    FontAwesomeIcon,
    FontAwesomeIconProps,
} from "@fortawesome/react-fontawesome";
import { ActionIcon, Box, Group, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React from "react";

export interface ItemProps {
    link: string;
    icon?: FontAwesomeIconProps["icon"];
    text: string;
    colour?: string;
    active?: boolean;
}

export interface NavigationListItemProps {
    item: ItemProps;
}

export const NavigationListItem: React.FC<NavigationListItemProps> = ({
    item,
}) => {
    const router = useRouter();
    const { link, icon, text, colour, active } = item;
    return (
        <Box
            onClick={() => !active && router.push(link)}
            sx={(theme) => ({
                background: active
                    ? theme.colors.violet[9]
                    : theme.colors.dark[5],
                borderRadius: theme.radius.md,
                cursor: "pointer",
            })}
            p="sm"
        >
            <Group>
                {icon && (
                    <ActionIcon variant="transparent" color={colour} size="lg">
                        <FontAwesomeIcon icon={icon} />
                    </ActionIcon>
                )}
                <Text>{text}</Text>
            </Group>
        </Box>
    );
};
