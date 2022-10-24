import { UserId } from '@lib/user/data/user.model'
import { events } from '@serverless/cloud'
import {
    buildIndex,
    Exact,
    indexBy,
    Model,
    SecondaryExact,
} from 'serverless-cloud-data-utils'
import { ulid } from 'ulid'

// To get a BaseModel by its type and ID *//
//namespace object_${object}:${baseModelId} */
export const ObjectType = (type: string) =>
    buildIndex({ namespace: `object_${type}` })

export abstract class BaseModel<T extends Model<T>> extends Model<T> {
    abstract object: string
    id: string
    name: string
    createdTime: string
    createdBy: string
    lastEditedTime: string
    lastEditedBy: string
    parent?: string
    collection?: string
    archived?: boolean

    //Todo update data-utils to allow editing of constructor obj
    constructor(obj?: any) {
        const date = new Date().toISOString()
        let config = {
            createdTime: date,
            lastEditedTime: date,
            id: ulid(),
            createdBy: 'system',
            lastEditedBy: 'system',
        }
        if (obj) {
            const { object, id, userId, ...rest } = obj
            config = {
                ...config,
                ...(id && { id }),
                ...(userId && { createdBy: userId, lastEditedBy: userId }),
                ...rest,
            }
        }

        super(config)
    }

    abstract modelKeys(): SecondaryExact[]

    keys() {
        const keyArray = [
            indexBy(ObjectType(this.object)).exact(this.id),
            ...this.modelKeys(),
        ]
        if (this.modelKeys.length > 5)
            throw new Error('Maximum of 5 keys allowed')
        return keyArray
    }
}
