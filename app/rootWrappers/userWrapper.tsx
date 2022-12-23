'use client'

import { UserProvider } from '@auth0/nextjs-auth0'

type Props = {
    children: React.ReactNode
}

export const UserWrapper = ({ children }: Props) => (
    <UserProvider>{children}</UserProvider>
)
