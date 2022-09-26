import { useReorderProperties } from "@data/contentTemplate/hooks";
import { ContentTemplate } from "@lib/contentTemplate/data/contentTemplate.model";
import { Box, Skeleton, Stack } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { FC, useEffect } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { CleanedCamel } from "type-helpers";
import { FieldCard } from "../field-card";

const FieldListSkeleton = () => (
    <Stack spacing="sm">
        <Skeleton height={80} />
        <Skeleton height={80} />
        <Skeleton height={80} />
    </Stack>
);

export const FieldList: FC<{ contentTemplate: CleanedCamel<ContentTemplate> }> = ({
    contentTemplate,
}) => {
    const [state, { setState, reorder }] = useListState(contentTemplate.properties);
    const { mutateAsync, error } = useReorderProperties();

    useEffect(() => {
        setState(contentTemplate.properties ?? []);
    }, [contentTemplate.properties, setState]);

    const items = contentTemplate.properties ? (
        state.map((field, index) => (
            <Draggable key={field.name} index={index} draggableId={field.name}>
                {(provided, snapshot) => (
                    <Box
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        ref={provided.innerRef}
                        mb="sm"
                    >
                        <FieldCard index={index} field={field} key={`field-${index}`} />
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
                    contentTemplateId: contentTemplate.id,
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
