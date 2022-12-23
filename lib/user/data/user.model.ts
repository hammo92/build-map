import { BaseModel, BaseModelId } from '../../../lib/models'
import { buildIndex, indexBy, Model } from 'serverless-cloud-data-utils'

//* User model and indexes *//

// To get user by id //
//namespace users:${userId} */
export const UserId = buildIndex({ namespace: `user`, label: 'label1' })

//model: User */
export class User extends BaseModel<User> {
    object = 'User'
    email: string
    hashedPassword: string
    emailVerified: boolean
    salt: string
    fullName: string
    nickname: string
    username: string

    // set on response
    avatar: string
    modelKeys() {
        return [indexBy(UserId).exact(this.id)]
    }
}
