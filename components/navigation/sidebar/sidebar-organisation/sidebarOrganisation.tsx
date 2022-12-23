'use client'

import { NavigationList } from '@components/navigation/linkList'
import { faFile, faHouse, faUser } from '@fortawesome/pro-regular-svg-icons'
import { organisationState } from '@state/organisation'
import { useSnapshot } from 'valtio'

export const SidebarOrganisation = () => {
    const { activeOrganisation } = useSnapshot(organisationState)
    return (
        <NavigationList
            items={[
                {
                    link: '/home',
                    icon: faHouse,
                    text: 'Home',
                },
                {
                    link: '/contentTemplates',
                    icon: faFile,
                    text: 'Content Templates',
                    active: false,
                },
                {
                    link: '/users',
                    icon: faUser,
                    text: 'Users',
                },
            ]}
        />
    )
}
