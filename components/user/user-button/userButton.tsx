'use client'

import { useUser } from '@auth0/nextjs-auth0'
import { faChevronRight } from '@fortawesome/pro-regular-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Drawer, Group, Skeleton, Text, UnstyledButton } from '@mantine/core'
import { useState } from 'react'
import { UserAvatar } from '../user-avatar'
import { UserSettings } from '../user-settings'
import { useStyles } from './styles'

export const UserButton = () => {
    const { user, error, isLoading } = useUser()
    const { classes } = useStyles()
    const [opened, setOpened] = useState(false)
    if (isLoading) return <Skeleton height={100} />
    if (user) {
        return (
            <>
                <UnstyledButton
                    className={classes.user}
                    onClick={() => setOpened(true)}
                >
                    <Group>
                        <UserAvatar user={user} radius="xl" />

                        <div style={{ flex: 1 }}>
                            <Text
                                size="sm"
                                weight={500}
                                style={{ textTransform: 'capitalize' }}
                            >
                                {user.nickname}
                            </Text>

                            <Text color="dimmed" size="xs">
                                {user.email}
                            </Text>
                        </div>

                        <FontAwesomeIcon icon={faChevronRight} />
                    </Group>
                </UnstyledButton>
                <Drawer
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Your Details"
                    padding="xl"
                    size="xl"
                    position="right"
                >
                    <UserSettings />
                </Drawer>
            </>
        )
    }
    return null
}
