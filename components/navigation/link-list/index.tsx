import { Group } from "@mantine/core";
import React from "react";
import { ItemProps, NavigationListItem } from "./list-item";

interface NavigationListProps {
    direction?: "column" | "row";
    items: ItemProps[];
}

export const NavigationList: React.FC<NavigationListProps> = ({
    direction = "column",
    items,
}) => {
    return (
        <Group direction={direction} grow={direction === "column"} spacing="xs">
            {items.map((item, i) => (
                <NavigationListItem key={i} item={item} />
            ))}
        </Group>
    );
};
