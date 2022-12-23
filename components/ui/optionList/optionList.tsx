import {
    faAdd,
    faCheck,
    faGripVertical,
    faPlusCircle,
    faTimes,
} from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Option } from '@lib/responseSet/data/responseSet.model'
import {
    ActionIcon,
    Box,
    Button,
    DefaultProps,
    extractSystemStyles,
    Group,
    Input,
    InputWrapperProps,
    MantineColor,
    MantineSize,
    MANTINE_COLORS,
    ScrollArea,
    TextInput,
} from '@mantine/core'
import { getHotkeyHandler, useUncontrolled } from '@mantine/hooks'
import { forwardRef, useState } from 'react'
import { DragDropContext, Draggable, Droppable } from 'react-beautiful-dnd'
import { ulid } from 'ulid'
import { moveInArray } from 'utils/arrayModify'
import { OptionListOption } from './optionList-option'
import { OptionActions } from './optionList-option/option-actions'
import { useStyles } from './styles'
import { BaseOptionListProps, BaseOptionListStylesNames } from './types'

export type OptionListProps = BaseOptionListProps &
    DefaultProps<BaseOptionListStylesNames> & {
        /** Controlled input value */
        value?: Option[]

        /** Uncontrolled input defaultValue */
        defaultValue?: Option[]

        /** Input onChange handler */
        onChange?: (value: Option[]) => void

        /** Called when item is removed */
        onRemove?: (value: Option) => void

        /** Input size */
        size?: MantineSize

        /** Max height of scroll contianer */
        maxHeight?: number

        wrapperProps?: InputWrapperProps
    }

const defaultProps: Partial<OptionListProps> = {
    required: false,
    disabled: false,
    size: 'sm',
    maxHeight: 200,
}

export const OptionList = forwardRef<HTMLInputElement, OptionListProps>(
    (props: OptionListProps, ref) => {
        const {
            className,
            style,
            required,
            label,
            id,
            error,
            description,
            size,
            maxHeight,
            value,
            defaultValue,
            onChange,
            onRemove,
            onBlur,
            onFocus,
            wrapperProps,
            classNames,
            styles,
            disabled,
            sx,
            name,
            errorProps,
            descriptionProps,
            labelProps,
            placeholder,
            form,
            ...others
        } = { ...props, ...defaultProps }
        const [_value, handleChange, inputMode] = useUncontrolled({
            value,
            defaultValue,
            finalValue: [],
            onChange: onChange!,
        })
        const { classes, cx } = useStyles()
        const { systemStyles, rest } = extractSystemStyles(others)

        // remove dark option from colors
        const colors = MANTINE_COLORS.filter((color) => color !== 'dark')
        const randomColor = () =>
            colors[Math.floor(Math.random() * colors.length)]

        const [newValue, setNewValue] = useState<string>('')
        const handleSubmit = () => {
            const newValues = newValue
                .split(',')
                .reduce<Option[]>((acc, val) => {
                    if (val.length) {
                        acc.push({
                            value: ulid(),
                            label: val.trim(),
                            color: randomColor(),
                        })
                    }
                    return acc
                }, [])

            handleChange([..._value, ...newValues])
            setNewValue('')
        }

        const onUpdate = (
            color: MantineColor,
            label: string,
            index: number
        ) => {
            const clone = structuredClone(_value)
            clone[index] = { ...clone[index], color, label }
            handleChange(clone)
        }

        const onDelete = (index: number) => {
            const clone = structuredClone(_value)
            onRemove && onRemove(clone[index])
            clone.splice(index, 1)
            handleChange(clone)
        }

        const items = _value.length
            ? _value.map((item, index) => (
                  <Draggable
                      key={item.value}
                      index={index}
                      draggableId={item.value}
                  >
                      {(provided, snapshot) => (
                          <div
                              className={cx(classes.item, {
                                  [classes.itemDragging]: snapshot.isDragging,
                              })}
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                          >
                              <Group
                                  position="apart"
                                  sx={{ width: '100%' }}
                                  pr="sm"
                              >
                                  <Group spacing={0}>
                                      <div
                                          {...provided.dragHandleProps}
                                          className={classes.dragHandle}
                                      >
                                          <FontAwesomeIcon
                                              icon={faGripVertical}
                                          />
                                      </div>

                                      <OptionListOption
                                          option={item}
                                          pr={0}
                                          rightSection={
                                              <ActionIcon
                                                  onClick={() =>
                                                      onDelete(index)
                                                  }
                                                  ml="sm"
                                                  variant="light"
                                              >
                                                  <FontAwesomeIcon
                                                      icon={faTimes}
                                                      size="xs"
                                                  />
                                              </ActionIcon>
                                          }
                                      />
                                  </Group>

                                  <OptionActions
                                      option={item}
                                      onChange={(color, label) =>
                                          onUpdate(color, label, index)
                                      }
                                      onDelete={() => onDelete(index)}
                                  />
                              </Group>
                          </div>
                      )}
                  </Draggable>
              ))
            : null

        return (
            <Input.Wrapper label={label} {...wrapperProps}>
                <Group>
                    <TextInput
                        name="option"
                        onChange={(event) => setNewValue(event.target.value)}
                        onKeyDown={getHotkeyHandler([['Enter', handleSubmit]])}
                        value={newValue}
                        placeholder={placeholder}
                        sx={{ border: 'none', flex: 1 }}
                        rightSection={
                            !!newValue.length && (
                                <ActionIcon
                                    variant="filled"
                                    color="violet"
                                    onClick={handleSubmit}
                                >
                                    <FontAwesomeIcon icon={faCheck} />
                                </ActionIcon>
                            )
                        }
                    />
                </Group>
                {!!_value.length && (
                    <Box
                        sx={(theme) => ({
                            borderRadius: `0 0 ${
                                theme.radius[theme.defaultRadius as 'sm']
                            }px ${theme.radius[theme.defaultRadius as 'sm']}px`,
                            marginTop: `-${
                                theme.radius[theme.defaultRadius as 'sm']
                            }px`,
                            paddingTop: `${
                                theme.radius[theme.defaultRadius as 'sm']
                            }px`,
                            background: theme.colors.dark[6],
                            border: `1px solid ${theme.colors.dark[4]}`,
                        })}
                    >
                        <ScrollArea.Autosize
                            maxHeight={maxHeight}
                            offsetScrollbars
                        >
                            <DragDropContext
                                onDragEnd={({ destination, source }) => {
                                    const transformed = moveInArray(
                                        _value,
                                        source.index,
                                        destination?.index ?? source.index
                                    )
                                    handleChange(transformed)
                                }}
                            >
                                <Droppable
                                    droppableId="dnd-list"
                                    direction="vertical"
                                >
                                    {(provided) => (
                                        <div
                                            {...provided.droppableProps}
                                            ref={provided.innerRef}
                                        >
                                            {items}
                                            {provided.placeholder}
                                        </div>
                                    )}
                                </Droppable>
                            </DragDropContext>
                        </ScrollArea.Autosize>
                    </Box>
                )}
            </Input.Wrapper>
        )
    }
)

OptionList.displayName = 'OptionList'
