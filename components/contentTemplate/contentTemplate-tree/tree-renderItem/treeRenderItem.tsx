import { RenderItemParams } from "@atlaskit/tree";
import { Group } from "@mantine/core";
import React from "react";
import { RenderItemField } from "./renderItem-field";
import { RenderItemPlaceholder } from "./renderItem-placeholder";
import { RenderItemGroup } from "./renderItem-group";
import { contentTemplateState } from "@state/contentTemplate";
import { useSnapshot } from "valtio";

export const TreeRenderItem = (props: RenderItemParams) => {
    const { item, provided } = props;

    return (
        <Group ref={provided.innerRef} {...provided.draggableProps}>
            {item.hasChildren ? (
                <RenderItemGroup {...props} />
            ) : item.data.isPlaceholder ? (
                <RenderItemPlaceholder {...props} />
            ) : (
                <RenderItemField {...props} />
            )}
        </Group>
    );
};
