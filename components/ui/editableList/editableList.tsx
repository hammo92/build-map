import { faGripDotsVertical, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Box, Input, InputWrapperProps, Select, Stack } from "@mantine/core";
import { useUncontrolled } from "@mantine/hooks";
import React, { forwardRef } from "react";
import { DragDropContext, Draggable, Droppable } from "react-beautiful-dnd";
import { objArrToKeyIndexedMap, reorderArray } from "utils/arrayModify";
import { useStyles } from "./styles";

interface ListBaseProps<T> {
    component?: (props: T) => JSX.Element;
    draggable?: boolean;
    data?: T[];
    value?: string[];
    placeholder?: string;
    loading?: boolean;
}

type NonEditableListProps<T> = ListBaseProps<T> & {
    editable?: false;
    selectComponent?: never;
    defaultValue?: never;
    onChange?: never;
};

interface ListProps<T> extends ListBaseProps<T> {
    editable?: true;
    selectComponent?: (props: T) => JSX.Element;
    defaultValue?: string[];
    onChange?: (data: string[]) => void;
}

type SelectItemProps<T> = React.ComponentPropsWithoutRef<"div"> & T;

export type EditableListProps<T> = Omit<InputWrapperProps, "children"> &
    (NonEditableListProps<T> | ListProps<T>);

export const EditableList = <T extends { label: string; value: string }>({
    data,
    component,
    selectComponent,
    editable,
    draggable,
    onChange,
    value,
    defaultValue,
    placeholder,
    loading,
    ...rest
}: EditableListProps<T>) => {
    const { classes, cx } = useStyles();

    const [_value, handleChange, inputMode] = useUncontrolled({
        value,
        defaultValue,
        finalValue: [],
        onChange: onChange!,
    });

    const valueIndexedItems = data ? objArrToKeyIndexedMap(data, "value") : new Map();

    const DefaultComponent = (props: T) => <Stack p="md">{props.label || props.value}</Stack>;

    const SelectItem = forwardRef<HTMLDivElement, SelectItemProps<T>>((props, ref) => {
        return (
            <div {...props}>
                {selectComponent ? (
                    selectComponent(props)
                ) : component ? (
                    component(props)
                ) : (
                    <DefaultComponent {...props} />
                )}
            </div>
        );
    });
    SelectItem.displayName = "SelectItem";

    const options: T[] = data ? data.filter(({ value }) => !_value.includes(value)) : [];

    const removeIndex = (index: number) => {
        const values = [..._value];
        values.splice(index, 1);
        handleChange(values);
    };

    const appendValue = (value: string) => {
        handleChange([..._value, value]);
    };

    const reorder = ({ from, to }: { from: number; to: number }) => {
        const reordered = reorderArray(_value, from, to);
        handleChange(reordered);
    };

    const items = _value
        ? _value.map((value, index) => {
              const props = valueIndexedItems.get(value);
              if (props) {
                  return (
                      <Draggable
                          key={props.value}
                          index={index}
                          draggableId={props.value}
                          isDragDisabled={!draggable}
                      >
                          {(provided, snapshot) => (
                              <div
                                  className={cx(classes.item, {
                                      [classes.itemDragging]: snapshot.isDragging,
                                  })}
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                              >
                                  {draggable && (
                                      <div
                                          {...provided.dragHandleProps}
                                          className={classes.dragHandle}
                                      >
                                          <FontAwesomeIcon icon={faGripDotsVertical} size="lg" />
                                      </div>
                                  )}
                                  <div className={classes.content}>
                                      {component ? (
                                          component(props)
                                      ) : (
                                          <DefaultComponent {...props} />
                                      )}
                                  </div>
                                  {editable && (
                                      <ActionIcon
                                          className={classes.removeButton}
                                          onClick={() => removeIndex(index)}
                                      >
                                          <FontAwesomeIcon icon={faTrash} />
                                      </ActionIcon>
                                  )}
                              </div>
                          )}
                      </Draggable>
                  );
              }
              return null;
          })
        : null;

    return (
        <Input.Wrapper {...rest}>
            <Stack spacing="sm">
                {editable || loading ? (
                    <Select
                        itemComponent={SelectItem}
                        data={options}
                        onChange={(value) => value && appendValue(value)}
                        disabled={!options.length || loading}
                        placeholder={
                            loading
                                ? "Loading"
                                : !options.length
                                ? "No options available"
                                : placeholder ?? "Add item"
                        }
                    />
                ) : null}
                <DragDropContext
                    onDragEnd={({ destination, source }) =>
                        reorder({ from: source.index, to: destination?.index || 0 })
                    }
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
            </Stack>
        </Input.Wrapper>
    );
};
