import { RenderItemParams } from "@atlaskit/tree";
import { Card } from "@mantine/core";
import React from "react";
import { useStyles } from "./styles";

export const RenderItemPlaceholder = ({ item, snapshot, provided }: RenderItemParams) => {
    const { classes } = useStyles();
    return (
        <Card
            p="md"
            shadow={snapshot.isDragging ? "lg" : "sm"}
            style={{ flex: 1 }}
            withBorder
            radius={0}
        >
            <div style={{ pointerEvents: "none" }} {...provided.dragHandleProps}>
                {item.data ? item.data.title : ""}
            </div>
        </Card>
    );
};
