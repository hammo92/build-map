import {
    Option,
    ResponseSet,
    ResponseSetCollection,
    ResponseSetId,
} from '../../../lib/responseSet/data/responseSet.model'
import { indexBy } from 'serverless-cloud-data-utils'

export interface CreateResponseSetProps {
    options: Option[]
    userId: string
    name: string
    parent?: string
}

export async function createResponseSet({
    options,
    parent,
    userId,
    name,
}: CreateResponseSetProps) {
    const responseSet = new ResponseSet({ userId })
    responseSet.options = options
    responseSet.name = name
    responseSet.parent = parent
    await responseSet.save()
    return responseSet
}

export interface GetResponseSetProps {
    responseSetId: string
    userId: string
}

export async function getResponseSet({
    responseSetId,
    userId,
}: GetResponseSetProps) {
    const [responseSet] = await indexBy(ResponseSetId)
        .exact(responseSetId)
        .get(ResponseSet)
    return responseSet
}

export interface GetResponseSetCollectionProps {
    userId: string
    collectionId: string
}

export async function getResponseSetCollection({
    userId,
    collectionId,
}: GetResponseSetCollectionProps) {
    const responseSets = await indexBy(ResponseSetCollection(collectionId)).get(
        ResponseSet
    )
    return responseSets
}

export interface UpdateResponseSetProps {
    responseSetId: string
    userId: string
    options?: Option[]
    name?: string
}

export async function updateResponseSet({
    responseSetId,
    userId,
    options,
    name,
}: UpdateResponseSetProps) {
    const responseSet = await getResponseSet({ responseSetId, userId })
    if (options) responseSet.options = options
    if (name) responseSet.name = name
    if (name || options) await responseSet.save()
    return responseSet
}

export interface DeleteResponseSetProps {
    responseSetId: string
    userId: string
}

export async function deleteResponseSet({
    responseSetId,
    userId,
}: DeleteResponseSetProps) {
    const responseSet = await getResponseSet({ responseSetId, userId })
    await responseSet.delete()
    return responseSet
}
