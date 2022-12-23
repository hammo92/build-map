import { StrippedUser } from '@lib/user/data'
import { User } from '@lib/user/data/user.model'
import { api } from '@serverless/cloud'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedCamel, CleanedSnake } from 'type-helpers'

export async function getMe() {
    const { data } = await apiClient.get<{
        user: StrippedUser
    }>(`/api/auth0/users/userinfo`)
    return camelcaseKeys(data, { deep: true })
}

export async function updateMe({
    userDetails,
}: {
    userDetails: Partial<CleanedCamel<User>>
}) {
    const { data } = await apiClient.patch<{
        user: CleanedSnake<StrippedUser>
    }>(`/me`, {
        userDetails,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function getUser({ userIdentifier }: { userIdentifier: string }) {
    const data = await apiClient.get<{ user: CleanedSnake<StrippedUser> }>(
        `api/auth0/users/${userIdentifier}`
    )
    return camelcaseKeys(data, { deep: true })
}
