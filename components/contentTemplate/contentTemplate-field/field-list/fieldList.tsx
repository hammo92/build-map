import React, { useEffect } from "react";
import { ContentTemplate as ContentTemplateProps } from "@lib/contentTemplate/data/contentTemplate.model";
import { Box, createStyles, Group, Skeleton, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FieldCard } from "../field-card";
import { Required } from "utility-types";
import { CleanedCamel } from "type-helpers";
import { useReorderContentTemplateFields } from "@data/contentTemplate/hooks";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { contentTemplateState } from "@state/contentTemplate";
import { ContentTemplateResponse } from "@data/contentTemplate/queries";
import { Keys } from "@data/contentTemplate/constants";

const FieldListSkeleton = () => (
    <Group direction="column" spacing="sm">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
    </Group>
);

export const FieldList = () => {
    const { contentTemplateId } = useSnapshot(contentTemplateState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTemplateResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTemplateId,
    ]);
    const [state, { setState, reorder }] = useListState(
        data?.contentTemplate?.fields
    );
    const { mutateAsync, error } = useReorderContentTemplateFields();

    useEffect(() => {
        setState(data?.contentTemplate?.fields ?? []);
    }, [data?.contentTemplate?.fields, setState]);

    const items = data ? (
        state.map((field, index) => (
            <Draggable key={field.name} index={index} draggableId={field.name}>
                {(provided, snapshot) => (
                    <Box
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        mb="sm"
                    >
                        <FieldCard
                            index={index}
                            field={field}
                            key={`field-${index}`}
                        />
                    </Box>
                )}
            </Draggable>
        ))
    ) : (
        <FieldListSkeleton />
    );

    return (
        <DragDropContext
            onDragEnd={async ({ destination, source }) => {
                const fromIndex = source.index;
                const toIndex = destination?.index ?? source.index;
                reorder({
                    from: fromIndex,
                    to: toIndex,
                });
                await mutateAsync({
                    contentTemplateId,
                    fromIndex,
                    toIndex,
                });
                // restore positions if error
                error &&
                    reorder({
                        from: toIndex,
                        to: fromIndex,
                    });
            }}
        >
            <Droppable droppableId="dnd-list" direction="vertical">
                {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                        {items}
                        {provided.placeholder}
                    </div>
                )}
            </Droppable>
        </DragDropContext>
    );
};
