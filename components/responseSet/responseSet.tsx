import * as React from 'react'
import { ResponseSet as ResponseSetModel } from '@lib/responseSet/data/responseSet.model'
import { ActionIcon, Card, Group, Menu, Text } from '@mantine/core'
import { OptionListOption } from '@components/ui/optionList/optionList-option'
import { CleanedCamel } from '../../type-helpers'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
    faCopy,
    faEdit,
    faEllipsisVertical,
    faTrash,
} from '@fortawesome/pro-regular-svg-icons'
import { ResponseSetUpdate } from '@components/responseSet/responseSet-update'
import { ResponseSetDuplicate } from '@components/responseSet/reponseSet-duplicate'

type ResponseSetProps = {
    responseSet: CleanedCamel<ResponseSetModel>
}

export function ResponseSet({ responseSet }: ResponseSetProps) {
    return (
        <Card>
            <Card.Section
                p={'sm'}
                sx={(theme) => ({ background: theme.colors.dark[7] })}
            >
                <Group position={'apart'}>
                    <Text>{responseSet.name ?? 'Unnamed Set'}</Text>
                    <Menu withinPortal position={'left-start'}>
                        <Menu.Target>
                            <ActionIcon>
                                <FontAwesomeIcon icon={faEllipsisVertical} />
                            </ActionIcon>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Label>Actions</Menu.Label>
                            <ResponseSetUpdate
                                responseSet={responseSet}
                                component={
                                    <Menu.Item
                                        icon={<FontAwesomeIcon icon={faEdit} />}
                                    >
                                        Update
                                    </Menu.Item>
                                }
                            />
                            <ResponseSetDuplicate
                                responseSet={responseSet}
                                component={
                                    <Menu.Item
                                        icon={<FontAwesomeIcon icon={faCopy} />}
                                    >
                                        Duplicate
                                    </Menu.Item>
                                }
                            />

                            <Menu.Divider />
                            <Menu.Label>Danger Zone</Menu.Label>
                            <Menu.Item
                                color={'red'}
                                icon={<FontAwesomeIcon icon={faTrash} />}
                            >
                                Delete
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                </Group>
            </Card.Section>
            <Card.Section p={'sm'}>
                <Group spacing="sm">
                    {responseSet.options.map((option, i) => (
                        <OptionListOption
                            key={`${option.value}${responseSet.id}${i}`}
                            option={option}
                        />
                    ))}
                </Group>
            </Card.Section>
        </Card>
    )
}
