import { useUncontrolled } from '@mantine/hooks'
import React from 'react'
import {
    ActionIcon,
    Group,
    Menu,
    NumberInput,
    Stack,
    Text,
    TextInput,
    Card,
    ScrollArea,
    Box,
} from '@mantine/core'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/pro-regular-svg-icons'
import { ControllerLabel } from '@components/smartForm/smartForm-controller/controller-label'
import { splitCamel } from '../../../../../utils/stringTransform'
import { UnstyledInput } from '@components/ui/unstyledInput/unstyledInput'
import structuredClone from '@ungap/structured-clone'
import { RemovableBadge } from '@components/ui/removableBadge'
import { DatePicker } from '@mantine/dates'

type ElementType = 'input' | 'string' | 'variable'

type TitleElementProps<T extends ElementType = ElementType> = {
    type: T
    variant?: T extends 'input'
        ? 'text' | 'number'
        : T extends 'variable'
        ?
              | 'entryNumber'
              | 'createdDate'
              | 'createdTime'
              | 'updatedDate'
              | 'updatedTime'
        : never
    value?: T extends 'string' ? string : never
}

const PREVIEWS: Record<string, JSX.Element> = {
    text: <TextInput placeholder={'text'} size={'xs'} />,
    number: <NumberInput placeholder={'10'} size={'xs'} />,
    entryNumber: <Text size={'xs'}>123</Text>,
    createdDate: <Text size={'xs'}>12/04/2023</Text>,
    createdTime: <Text size={'xs'}>12:00:00</Text>,
    updatedDate: <Text size={'xs'}>12/04/2023</Text>,
    updatedTime: <Text size={'xs'}>12:00:00</Text>,
}

const FIELDS: {
    title: string
    type: TitleElementProps['type']
    options: TitleElementProps['variant'][]
}[] = [
    {
        type: 'input',
        title: 'User input',
        options: ['text', 'number'],
    },
    {
        type: 'variable',
        title: 'Generated value',
        options: [
            'entryNumber',
            'createdDate',
            'createdTime',
            'updatedDate',
            'updatedTime',
        ],
    },
]

const TitleElement = ({
    element,
    isLast,
    removeItem,
    updateItem,
}: {
    element: TitleElementProps
    isLast: boolean
    removeItem: () => void
    updateItem: (item: TitleElementProps) => void
}) => {
    if (element.type === 'input') {
        return (
            <RemovableBadge
                radius={'sm'}
                label={`input: ${splitCamel(element.variant!)}`}
                onRemove={() => removeItem()}
            />
        )
    }
    if (element.type === 'string') {
        return (
            <UnstyledInput
                width={isLast ? 'full' : 'fit'}
                value={`${element.value}`}
                onChange={(value) => updateItem({ ...element, value })}
            />
        )
    }
    if (element.type === 'variable') {
        return (
            <RemovableBadge
                color={'teal'}
                radius={'sm'}
                label={`generated: ${splitCamel(element.variant!)}`}
                onRemove={() => removeItem()}
            />
        )
    }
    return null
}

const TitlePreview = ({ fields }: { fields: TitleElementProps[] }) => {
    return (
        <Card
            p={'sm'}
            sx={(theme) => ({
                background: theme.colors.dark[8],
                borderRadius: `0 0 ${
                    theme.radius[theme.defaultRadius as 'sm']
                }px ${theme.radius[theme.defaultRadius as 'sm']}px `,
            })}
        >
            <Group spacing={0}>
                {fields.map((field) => {
                    if (field.type === 'string') {
                        return <Text size={'xs'}>{field.value}</Text>
                    }
                    return <>{PREVIEWS[field.variant]}</>
                })}
            </Group>
        </Card>
    )
}

export const FieldsTitle = ({
    value,
    onChange,
    defaultValue,
}: {
    value?: TitleElementProps[]
    onChange: (elements: TitleElementProps[]) => void
    defaultValue?: TitleElementProps[]
}) => {
    const [_value, handleChange] = useUncontrolled({
        value,
        defaultValue,
        finalValue: [
            {
                type: 'string',
                value: '',
            },
        ],
        onChange,
    })

    const addItem = (props: TitleElementProps) => {
        // add item with a text input field
        handleChange([
            ..._value,
            props,
            {
                type: 'string',
                value: '',
            },
        ])
    }

    /** Remove item and merge surrounding strings **/
    const removeItem = (index: number) => {
        const nextItem = _value[index + 1]
        const prevItem = index > 0 ? _value[index - 1] : undefined

        // remove item and merge surrounding strings
        if (nextItem.type === 'string' && prevItem?.type === 'string') {
            const clone = structuredClone(_value)
            clone.splice(index - 1, 3, {
                ...prevItem,
                value: (prevItem?.value ?? '').concat(nextItem.value ?? ''),
            })
            handleChange(clone)
        }
    }

    const updateItem = (index: number, updatedValue: TitleElementProps) => {
        const clone = structuredClone(_value)
        clone.splice(index, 1, updatedValue)
        handleChange(clone)
    }

    return (
        <Stack spacing={'xs'}>
            <Group position={'apart'}>
                <ControllerLabel label={'Title Template'} />
                <Menu position="left-start">
                    <Menu.Target>
                        <ActionIcon size={'sm'}>
                            <FontAwesomeIcon icon={faPlus} />
                        </ActionIcon>
                    </Menu.Target>
                    <Menu.Dropdown>
                        {FIELDS.map(({ title, type, options }) => (
                            <>
                                <Menu.Label>{title}</Menu.Label>
                                {options.map((variant) => (
                                    <Menu.Item
                                        key={variant}
                                        sx={{ textTransform: 'capitalize' }}
                                        onClick={() =>
                                            addItem({
                                                type,
                                                variant: variant,
                                            })
                                        }
                                    >
                                        {splitCamel(variant!)}
                                    </Menu.Item>
                                ))}
                            </>
                        ))}
                    </Menu.Dropdown>
                </Menu>
            </Group>
            <Stack spacing={0}>
                <Box
                    sx={(theme) => ({
                        background: theme.colors.dark[6],
                        flex: '1',
                        border: `1px solid ${theme.colors.dark[4]}`,
                        borderRadius: `${
                            theme.radius[theme.defaultRadius as 'sm']
                        }px ${theme.radius[theme.defaultRadius as 'sm']}px 0 0`,
                    })}
                >
                    <Group spacing={0} p={'sm'} noWrap>
                        {_value.map((element, i) => (
                            <>
                                <TitleElement
                                    element={element}
                                    key={`${i}${element.type}`}
                                    isLast={i === _value.length - 1}
                                    removeItem={() => removeItem(i)}
                                    updateItem={(item) => updateItem(i, item)}
                                />
                            </>
                        ))}
                    </Group>
                </Box>

                <TitlePreview fields={_value} />
            </Stack>
        </Stack>
    )
}
