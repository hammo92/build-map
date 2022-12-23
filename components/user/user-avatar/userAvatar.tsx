import { UserProfile } from '@auth0/nextjs-auth0'
import { StrippedUser } from '@lib/user/data'
import { Avatar, AvatarProps, MantineSize } from '@mantine/core'
import React from 'react'
import { CleanedCamel } from 'type-helpers'

interface UserAvatarProps extends Omit<AvatarProps, 'src'> {
    user: UserProfile
}

export const UserAvatar = ({ user, size, ...rest }: UserAvatarProps) => {
    const avatarSize = (): MantineSize => {
        if (typeof size === 'string') {
            return size
        }
        if (typeof size === 'number') {
            size < 50
                ? 'xs'
                : size < 100
                ? 'sm'
                : size < 200
                ? 'md'
                : size < 400
                ? 'lg'
                : size < 800
                ? 'xl'
                : 'full'
        }
        return 'sm'
    }
    return <Avatar {...rest} size={size} src={user.picture} />
}
