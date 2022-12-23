import { OrganisationRoles } from '@lib/organisation/data'
import { Organisation } from '@lib/organisation/data/organisation.model'
import { User } from '@lib/user/data/user.model'
import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedSnake } from 'type-helpers'

export async function createOrganisation({ name }: { name: string }) {
    const { data } = await apiClient.post<{
        organisation: CleanedSnake<Organisation>
    }>(`/api/proxy/organisations`, {
        name,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function getMyOrganisations() {
    const { data } = await apiClient.get<{
        organisations: CleanedSnake<Organisation>[]
    }>(`/api/proxy/me/organisations`)
    return camelcaseKeys(data, { deep: true })
}

export async function getOrganisationUsers({
    organisationId,
}: {
    organisationId: string
}) {
    const { data } = await apiClient.get<{
        usersAndRoles: { user: CleanedSnake<User>; role: OrganisationRoles }[]
    }>(`/api/proxy/organisations/${organisationId}/users`)
    return camelcaseKeys(data, { deep: true })
}
