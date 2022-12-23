import { MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { QueryClient, QueryClientProvider } from 'react-query'
import '../styles/globals.css'
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'
import type { AppProps } from 'next/app'
import { UserProvider } from '@auth0/nextjs-auth0'

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout
}

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page)
    // Create a client
    const queryClient = new QueryClient()
    return (
        <UserProvider>
            <QueryClientProvider client={queryClient}>
                <MantineProvider
                    withGlobalStyles
                    withNormalizeCSS
                    theme={{
                        colors: {
                            dark: [
                                '#B7B8C3',
                                '#8C8EA2',
                                '#6A6D88',
                                '#53556E',
                                '#40435A',
                                '#32344A',
                                '#26283D',
                                '#1E1F2C',
                                '#171821',
                                '#121218',
                            ],
                        },
                        spacing: {
                            xs: 5,
                            sm: 8,
                        },
                        fontFamilyMonospace: 'relative-mono, Menlo, monospace',
                        headings: {
                            fontFamily:
                                'relative-pro, Roboto, system-ui, -apple-system, BlinkMacSystemFont',
                        },
                        defaultRadius: 'sm',
                        //primaryShade: 8,
                        fontFamily:
                            'relative-pro, Roboto, system-ui, -apple-system, BlinkMacSystemFont',
                        colorScheme: 'dark',
                    }}
                >
                    <NotificationsProvider>
                        <ModalsProvider>
                            {getLayout(<Component {...pageProps} />)}
                        </ModalsProvider>
                    </NotificationsProvider>
                </MantineProvider>
            </QueryClientProvider>
        </UserProvider>
    )
}

export default MyApp
