import { RenderItemParams } from "@atlaskit/tree";
import { Group } from "@mantine/core";
import React from "react";
import { RenderItemField } from "./renderItem-field";
import { RenderItemPlaceholder } from "./renderItem-placeholder";
import { RenderItemGroup } from "./renderItem-group";

export const ListRenderItem = (props: RenderItemParams) => {
    const { item, provided } = props;

    return (
        <div ref={provided.innerRef} {...provided.draggableProps}>
            {item.hasChildren ? (
                <RenderItemGroup {...props} />
            ) : item.data.isPlaceholder ? (
                <RenderItemPlaceholder {...props} />
            ) : (
                <RenderItemField {...props} />
            )}
        </div>
    );
};
