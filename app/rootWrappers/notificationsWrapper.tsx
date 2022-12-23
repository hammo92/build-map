'use client'

import { NotificationsProvider } from '@mantine/notifications'

type Props = {
    children: React.ReactNode
}

export const NotificationsWrapper = ({ children }: Props) => (
    <NotificationsProvider>{children}</NotificationsProvider>
)
