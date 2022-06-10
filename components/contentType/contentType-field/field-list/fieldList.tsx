import React, { useEffect } from "react";
import { ContentType as ContentTypeProps } from "@lib/contentType/data/contentType.model";
import { Box, createStyles, Group, Skeleton, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FieldCard } from "../field-card";
import { Required } from "utility-types";
import { CleanedCamel } from "type-helpers";
import { useReorderContentTypeFields } from "@data/contentType/hooks";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { contentTypeState } from "@state/contentType";
import { ContentTypeResponse } from "@data/contentType/queries";
import { Keys } from "@data/contentType/constants";

const useStyles = createStyles((theme) => ({
    item: {
        ...theme.fn.focusStyles(),
        display: "flex",
        alignItems: "center",
        borderRadius: theme.radius.md,
        border: `1px solid ${
            theme.colorScheme === "dark"
                ? theme.colors.dark[5]
                : theme.colors.gray[2]
        }`,
        padding: `${theme.spacing.sm}px ${theme.spacing.xl}px`,
        backgroundColor:
            theme.colorScheme === "dark" ? theme.colors.dark[5] : theme.white,
        marginBottom: theme.spacing.sm,
    },

    itemDragging: {
        boxShadow: theme.shadows.sm,
    },

    symbol: {
        fontSize: 30,
        fontWeight: 700,
        width: 60,
    },
}));

export const FieldList = () => {
    const { contentTypeId } = useSnapshot(contentTypeState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<ContentTypeResponse>([
        Keys.GET_CONTENT_TYPE,
        contentTypeId,
    ]);
    const { classes, cx } = useStyles();
    const [state, { setState, reorder }] = useListState(
        data?.contentType?.fields
    );
    const { mutateAsync, error } = useReorderContentTypeFields();

    useEffect(() => {
        setState(data?.contentType?.fields ?? []);
    }, [data?.contentType?.fields, setState]);

    // show skeleton while loading data
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
        <Group direction="column" spacing="sm">
            <Skeleton height={80} />
            <Skeleton height={80} />
            <Skeleton height={80} />
        </Group>
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
                    contentTypeId,
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
