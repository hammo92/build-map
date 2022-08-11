import { theme } from "@definitions/mantine";
import { Global, MantineProvider } from "@mantine/core";
import { ModalsProvider } from "@mantine/modals";
import { NotificationsProvider } from "@mantine/notifications";
import { QueryClient, QueryClientProvider } from "react-query";
import "../styles/globals.css";
import type { ReactElement, ReactNode } from "react";
import type { NextPage } from "next";
import type { AppProps } from "next/app";
import { styles } from "@definitions/mantine/styles";

type NextPageWithLayout = NextPage & {
    getLayout?: (page: ReactElement) => ReactNode;
};

type AppPropsWithLayout = AppProps & {
    Component: NextPageWithLayout;
};

function MyApp({ Component, pageProps }: AppPropsWithLayout) {
    // Use the layout defined at the page level, if available
    const getLayout = Component.getLayout || ((page) => page);
    // Create a client
    const queryClient = new QueryClient();
    return (
        <QueryClientProvider client={queryClient}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={{
                    /** Put your mantine theme override here */
                    ...theme,
                    colorScheme: "dark",
                }}
                styles={styles}
            >
                <NotificationsProvider>
                    <ModalsProvider>{getLayout(<Component {...pageProps} />)}</ModalsProvider>
                </NotificationsProvider>
            </MantineProvider>
        </QueryClientProvider>
    );
}

export default MyApp;
