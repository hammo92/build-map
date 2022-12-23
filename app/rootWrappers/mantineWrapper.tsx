'use client'

import { CacheProvider } from '@emotion/react'
import { DEFAULT_THEME, MantineProvider, useEmotionCache } from '@mantine/core'
import { themeOverrides } from 'app/theme/themeOverrides'
import { setCookie } from 'cookies-next'
import { useServerInsertedHTML } from 'next/navigation'
import React from 'react'
import '../../styles/globals.css'

interface LayoutProps {
    children: React.ReactNode
}

export const MantineWrapper = ({ children }: LayoutProps) => {
    const cache = useEmotionCache()
    cache.compat = true

    useServerInsertedHTML(() => (
        <style
            data-emotion={`${cache.key} ${Object.keys(cache.inserted).join(
                ' '
            )}`}
            dangerouslySetInnerHTML={{
                __html: Object.values(cache.inserted).join(' '),
            }}
        />
    ))

    return (
        <CacheProvider value={cache}>
            <MantineProvider
                withGlobalStyles
                withNormalizeCSS
                theme={themeOverrides}
            >
                {children}
            </MantineProvider>
        </CacheProvider>
    )
}
