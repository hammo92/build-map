import camelcaseKeys from 'camelcase-keys'
import { apiClient } from 'data/config'
import { CleanedSnake } from 'type-helpers'
import {
    CreateResponseSetProps,
    DeleteResponseSetProps,
    GetResponseSetCollectionProps,
    GetResponseSetProps,
    UpdateResponseSetProps,
} from '@lib/responseSet/data'
import { ResponseSet } from '@lib/responseSet/data/responseSet.model'

// generic to omit userId from lib data props
type NoUser<T> = Omit<T, 'userId'>

export async function createResponseSet({
    options,
    parent,
    name,
}: NoUser<CreateResponseSetProps>) {
    const { data } = await apiClient.post<{
        responseSet: CleanedSnake<ResponseSet>
    }>(`/responseSets`, {
        options,
        parent,
        name,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function getResponseSet({
    responseSetId,
}: NoUser<GetResponseSetProps>) {
    const { data } = await apiClient.get<{
        responseSet: CleanedSnake<ResponseSet>
    }>(`/responseSets/${responseSetId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function getResponseSetCollection({
    collectionId,
}: NoUser<GetResponseSetCollectionProps>) {
    const { data } = await apiClient.get<{
        responseSets: CleanedSnake<ResponseSet>[]
    }>(`/responseSets/collections/${collectionId}`)
    return camelcaseKeys(data, { deep: true })
}

export async function updateResponseSet({
    responseSetId,
    options,
    name,
}: NoUser<UpdateResponseSetProps>) {
    const { data } = await apiClient.patch<{
        responseSet: CleanedSnake<ResponseSet>
    }>(`/responseSets/${responseSetId}`, {
        options,
        name,
    })
    return camelcaseKeys(data, { deep: true })
}

export async function deleteResponseSet({
    responseSetId,
}: NoUser<DeleteResponseSetProps>) {
    const { data } = await apiClient.delete<{
        responseSet: CleanedSnake<ResponseSet>
    }>(`/responseSets/${responseSetId}`)
    return camelcaseKeys(data, { deep: true })
}
