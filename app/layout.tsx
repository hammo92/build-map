import {
    ReactQueryWrapper,
    FullHeightWrapper,
    ModalsWrapper,
    NotificationsWrapper,
    UserWrapper,
    MantineWrapper,
} from './rootWrappers'
import '../styles/globals.css'

export default function RootLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <html lang="en-US">
            <head></head>
            <body>
                <UserWrapper>
                    <ReactQueryWrapper>
                        <NotificationsWrapper>
                            <ModalsWrapper>
                                <MantineWrapper>
                                    <FullHeightWrapper>
                                        {children}
                                    </FullHeightWrapper>
                                </MantineWrapper>
                            </ModalsWrapper>
                        </NotificationsWrapper>
                    </ReactQueryWrapper>
                </UserWrapper>
            </body>
        </html>
    )
}
