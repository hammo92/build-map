import { Group, Title } from '@mantine/core'
import { getCookie } from 'cookies-next'
import React from 'react'
import { cookies } from 'next/headers'
import { themeDefault, themeOverrides } from '../../theme'
import { UserButton } from '@components/user/user-button/userButton'
import { SidebarOrganisation } from '@components/navigation/sidebar/sidebar-organisation/sidebarOrganisation'

type Props = {
    children: React.ReactNode
}

const Layout = ({ children, ...rest }: Props) => {
    console.log('rest :>> ', rest)
    return (
        <div className="md:flex md:flex-shrink-0 h-full">
            <div className="flex flex-col w-64 justify-between">
                <div className="flex flex-col">
                    <div className="h-76 p-4 text-lg font-bold">
                        <p>BuildMap</p>
                    </div>
                    {/* <SidebarOrganisation /> */}
                </div>

                <UserButton />
            </div>
            {children}
        </div>
    )
}

export default Layout
