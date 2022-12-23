'use client'

import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

type Props = {
    children: React.ReactNode
}

export const ReactQueryWrapper = ({ children }: Props) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
)
