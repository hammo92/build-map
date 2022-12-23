'use client'

import { ModalsProvider } from '@mantine/modals'

type Props = {
    children: React.ReactNode
}

export const ModalsWrapper = ({ children }: Props) => (
    <ModalsProvider>{children}</ModalsProvider>
)
