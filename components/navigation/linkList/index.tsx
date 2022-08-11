import { Group, Stack } from "@mantine/core";
import React from "react";
import { ItemProps, NavigationListItem } from "./linkList-item";

interface NavigationListProps {
    items: ItemProps[];
}

export const NavigationList: React.FC<NavigationListProps> = ({ items }) => {
    return (
        <Stack spacing="xs">
            {items.map((item, i) => (
                <NavigationListItem key={i} item={item} />
            ))}
        </Stack>
    );
};
