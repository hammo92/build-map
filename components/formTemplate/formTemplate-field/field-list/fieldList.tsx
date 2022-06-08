import React, { useEffect } from "react";
import { FormTemplate as FormTemplateProps } from "@lib/formTemplate/data/formTemplate.model";
import { Box, createStyles, Group, Skeleton, Text } from "@mantine/core";
import { useListState } from "@mantine/hooks";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { FieldCard } from "../field-card";
import { Required } from "utility-types";
import { CleanedCamel } from "type-helpers";
import { useReorderFormTemplateFields } from "@data/formTemplate/hooks";
import { useQueryClient } from "react-query";
import { useSnapshot } from "valtio";
import { formTemplateState } from "@state/formTemplate";
import { FormTemplateResponse } from "@data/formTemplate/queries";
import { Keys } from "@data/formTemplate/constants";

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
    const { formTemplateId } = useSnapshot(formTemplateState);
    const queryClient = useQueryClient();
    const data = queryClient.getQueryData<FormTemplateResponse>([
        Keys.GET_FORM_TEMPLATE,
        formTemplateId,
    ]);
    const { classes, cx } = useStyles();
    const [state, handlers] = useListState(data?.formTemplate?.fields);
    const { mutateAsync, error } = useReorderFormTemplateFields();

    useEffect(() => {
        handlers.setState(data?.formTemplate?.fields ?? []);
    }, [data?.formTemplate?.fields, handlers]);

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
                handlers.reorder({
                    from: fromIndex,
                    to: toIndex,
                });
                await mutateAsync({
                    formTemplateId,
                    fromIndex,
                    toIndex,
                });
                // restore positions if error
                error &&
                    handlers.reorder({
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
