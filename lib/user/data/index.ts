import { getImageUrl } from '../../../lib/asset/data'
import { params, Request, storage } from '@serverless/cloud'
import crypto from 'crypto'
import jwt, { JwtPayload } from 'jsonwebtoken'
import { indexBy } from 'serverless-cloud-data-utils'
import { CleanedCamel } from 'type-helpers'
import util from 'util'
import { Required } from 'utility-types'
import { v4 as uuid } from 'uuid'
import { errorIfUndefined } from '../../utils'
import { User, UserId } from './user.model'
import invariant from 'tiny-invariant'
import axios from 'axios'

const pbkdf2 = util.promisify(crypto.pbkdf2)

const TOKEN_SECRET = params.TOKEN_SECRET

export const USER_UUID_NAMESPACE = '9738E54D-3350-402B-9849-35F0ECEB772C'

export type StrippedUser = Omit<User, 'salt' | 'hashedPassword'>

//* Create user token */
// export async function createUserToken({
//     id,
//     name,
//     email,
// }: {
//     id: string
//     name: string
//     email: string
// }) {
//     return jwt.sign({ id, email, name }, TOKEN_SECRET)
// }

// //* Verify token */
// export function verifyToken(token: string) {
//     return jwt.verify(token, TOKEN_SECRET)
// }

//* Authenticate user from token */
// export function auth() {
//     return async function (req: any, res: any, next: any) {
//         console.log('hello')
//         try {
//             const token = req.get('Authorization')?.replace('Bearer ', '')
//             //set user in req for below api calls
//             req.user = verifyToken(token)
//             return next()
//         } catch (error) {
//             res.status(403).send({
//                 message: 'Invalid authorization token',
//             })
//         }
//     }
// }

//* Create user */
export async function createUser({
    id,
    email,
}: {
    id: string
    email?: string
}) {
    errorIfUndefined({ id })
    const newUser = new User({ id, email })
    await newUser.save()
    return newUser
}

//* Update user */
export async function updateUser(
    props: Partial<CleanedCamel<User>> & { password?: string; userId: string }
) {
    //remove values that shouldn't be updated, and values which require additional processing

    const { id, hashedPassword, salt, password, name, userId, ...rest } = props
    errorIfUndefined([userId])

    const [user] = await indexBy(UserId).exact(userId).get(User)
    if (!user) {
        throw new Error('No user exists with provided Id')
    }

    const updatedUser = { ...user, ...rest }

    updatedUser.lastEditedBy = userId
    updatedUser.lastEditedTime = new Date().toISOString()

    await new User({ ...updatedUser }).save()
    return user
}

//* Get user //
async function getUser(userId: string) {
    const [user] = await indexBy(UserId).exact(userId).get(User)

    return user
}

//* Get user by id */
export async function getUserById(userId: string) {
    errorIfUndefined([userId])
    const user = await getUser(userId)
    return user
}

//* Delete user by id */
export async function deleteUserById(userId: string) {
    errorIfUndefined([userId])
    const [user] = await indexBy(UserId).exact(userId).get(User)
    if (!user) {
        throw new Error('No user exists for this email')
    }
    await user.delete()

    return user
}

//* Get user by email */
export async function getUserByEmail(userEmail: string, token: string) {
    errorIfUndefined([userEmail])
    var options = {
        method: 'GET',
        url: 'https://dev-nwr0-alx.us.auth0.com/api/v2/users-by-email',
        params: { email: userEmail },
        headers: { authorization: token },
    }
    const auth0User = await axios.request(options)
    const {
        user: { user_id },
    } = auth0User.data
    const user = await getUser(user_id)
    return user
}

//* Get logged in user from token in req header */
export function getUserFromReqAuthHeader(req: Request): string | JwtPayload {
    const token = req.get('Authorization')?.replace('Bearer ', '') as string
    invariant('token', 'No user logged in')
    const user = jwt.verify(token, TOKEN_SECRET)
    if (!user) {
        throw new Error('No user found')
    }
    return user
}
