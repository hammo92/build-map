import { useRepeatGroup, useDeleteGroup } from '@data/content/hooks'
import {
    faChevronCircleRight,
    faTrash,
} from '@fortawesome/pro-regular-svg-icons'
import { faChevronCircleDown } from '@fortawesome/pro-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Content as ContentProps } from '@lib/content/data/content.model'

import { Field as FieldProps, PropertyGroup } from '@lib/field/data/field.model'
import {
    ActionIcon,
    Button,
    Collapse,
    Group,
    Loader,
    Stack,
    Text,
} from '@mantine/core'
import { useState } from 'react'
import { CleanedCamel } from 'type-helpers'
import { Field } from '../../field'
import { useStyles } from './styles'
import { useForm, useFormState } from 'react-hook-form'

export interface FieldGroup extends Omit<PropertyGroup, 'children'> {
    children: (CleanedCamel<FieldProps> | FieldGroup)[]
}

export const ListGrouped = ({
    contentId,
    fieldGroup,
    depth = 0,
    removable,
}: {
    contentId: string
    fieldGroup: FieldGroup
    depth?: number
    removable?: boolean
}) => {
    const [opened, setOpened] = useState(true)
    const { classes } = useStyles()
    const { setValue, register, getValues, reset } = useForm()
    const { mutateAsync, isLoading } = useRepeatGroup()

    // duplicate group and set any values into form
    const repeatGroup = async (props: {
        contentId: string
        groupId: string
    }) => {
        const { newFields } = await mutateAsync(props)
        newFields.forEach((field) => {
            console.log('👉 field >>', field)
            setValue(field.id, field.value, {
                shouldDirty: true,
                shouldTouch: true,
            })
        })
    }

    const { mutateAsync: deleteGroup, isLoading: isRemoving } = useDeleteGroup()

    const contents = (
        <Stack spacing={opened ? 'xs' : 0} style={{ flex: '1' }} pt="xs">
            {fieldGroup.children.map((child) => {
                if (child.type === 'propertyGroup') {
                    return (
                        <ListGrouped
                            key={child.id}
                            fieldGroup={child}
                            depth={depth + 1}
                            contentId={contentId}
                            removable={
                                fieldGroup.repeatable &&
                                fieldGroup.children.length > 1
                            }
                        />
                    )
                }
                return <Field field={child} key={child.id} />
            })}
        </Stack>
    )

    // Don't render title and indent for root group
    if (depth === 0) {
        return contents
    }

    return (
        <Stack p={0}>
            <Stack spacing={0} className={classes.group}>
                <Group
                    spacing="sm"
                    p="xs"
                    sx={(theme) => ({
                        border: `1px solid ${theme.colors.dark[5]}`,
                        //background: theme.colors.dark[6],
                        borderRadius: `0 0 0 ${theme.radius.md}px`,
                    })}
                    position="apart"
                >
                    <Group spacing="xs">
                        <ActionIcon onClick={() => setOpened(!opened)}>
                            <FontAwesomeIcon
                                icon={
                                    opened
                                        ? faChevronCircleDown
                                        : faChevronCircleRight
                                }
                            />
                        </ActionIcon>
                        <Text>{fieldGroup.name}</Text>
                    </Group>
                    <Group>
                        {fieldGroup.repeatable && (
                            <Button
                                size="xs"
                                variant="subtle"
                                onClick={async () =>
                                    repeatGroup({
                                        contentId,
                                        groupId: `${fieldGroup.id}`,
                                    })
                                }
                                disabled={isLoading}
                                loading={isLoading}
                            >
                                Add entry
                            </Button>
                        )}
                        {removable && (
                            <ActionIcon
                                color="red"
                                onClick={async () =>
                                    deleteGroup({
                                        groupId: `${fieldGroup.id}`,
                                        contentId,
                                    })
                                }
                                disabled={isRemoving}
                                loading={isRemoving}
                            >
                                <FontAwesomeIcon icon={faTrash} />
                            </ActionIcon>
                        )}
                    </Group>
                </Group>
                <Collapse in={opened}>
                    <div className={classes.child}>
                        <div className={classes.indent} />
                        {contents}
                    </div>
                </Collapse>
            </Stack>
        </Stack>
    )
}
