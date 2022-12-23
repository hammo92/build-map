import { api, params } from '@serverless/cloud'
import {
    createUser,
    deleteUserById,
    getUserByEmail,
    getUserById,
    updateUser,
} from '../data/index'
import util from 'util'
import crypto from 'crypto'
import { ErrorInfo } from 'react'
import jwt_decode from 'jwt-decode'

const pbkdf2 = util.promisify(crypto.pbkdf2)

import { auth } from 'express-openid-connect/'
import { rewritePath } from 'next-http-proxy-middleware'
import invariant from 'tiny-invariant'

const TOKEN_SECRET = params.TOKEN_SECRET

const config = {
    authRequired: false,
    auth0Logout: true,
    secret: TOKEN_SECRET,
    baseURL: 'http://localhost:3000',
    clientID: 'et3aa2oVEspwK84cv5mGlrWu72toGjNn',
    issuerBaseURL: 'https://dev-nwr0-alx.us.auth0.com',
}

export const users = () => {
    //* Create a user */
    api.post('/users', async function (req: any, res: any) {
        try {
            const { id, email } = req.body
            const user = await createUser({
                id,
                email,
            })
            res.status(200).send({
                user,
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error?.message,
            })
        }
    })

    //* Login user */
    // api.post('/login', async function (req: any, res: any) {
    //     try {
    //         const user = await getUserByEmail(req.body.email)
    //         if (!user) {
    //             throw new Error('Email or password is incorrect')
    //         }
    //         const { id, name, email } = user
    //         // hash password to check against encypted
    //         const hashedPassword = (
    //             await pbkdf2(req.body.password, user.salt, 310000, 32, 'sha256')
    //         ).toString()
    //         // Check if password is correct, throw generic error on fail
    //         if (
    //             !crypto.timingSafeEqual(
    //                 Buffer.from(user.hashedPassword),
    //                 Buffer.from(hashedPassword.toString())
    //             )
    //         ) {
    //             throw new Error('Email or password is incorrect')
    //         }
    //         const token = await createUserToken({ id, name, email })
    //         res.status(200).send({
    //             token,
    //             user,
    //         })
    //     } catch (error: any) {
    //         console.log(error)
    //         return res.status(403).send({
    //             message: error?.message,
    //         })
    //     }
    // })

    //* Authenticate token for user */
    // api.post('/authenticate', async function (req: any, res: any) {
    //     try {
    //         if (!req.body.token) {
    //             throw new Error('No token available')
    //         }
    //         req.body.token.replace('Bearer ', '')
    //         const user = verifyToken(req.body.token)
    //         res.status(200).send({
    //             user: user,
    //         })
    //     } catch (error) {
    //         res.status(403).send({
    //             message: 'Invalid authorization token',
    //         })
    //     }
    // })

    //* root level middleware, runs on every request to the api to authenticate user, runs on everthing but register, login, and authenticate
    api.use(auth(config))
    api.use((req: any, res, next) => {
        try {
            const token = req
                .get('authorization')
                ?.replace('Bearer ', '') as string
            invariant(token, 'No valid token found')
            const decoded = jwt_decode(token) as { id: string }
            invariant(decoded.id, 'No user id found')
            req.user = decoded
            return next()
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get logged in user */
    api.get('/me', async function name(req: any, res: any) {
        try {
            const user = await getUserById(req.user.id)
            res.status(200).send({
                user: user.clean(['salt', 'hashedPassword']),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Update logged in user */
    api.patch('/me', async function name(req: any, res: any) {
        try {
            const user = await updateUser({
                userId: req.user.id,
                ...req.body.userDetails,
            })

            res.status(200).send({
                user: user.clean(['salt', 'hashedPassword']),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Delete logged in user */
    api.delete('/me', async function name(req: any, res: any) {
        try {
            const user = await deleteUserById(req.user.id)
            res.status(200).send({
                user: user.clean(['salt', 'hashedPassword']),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get user by id or email */
    api.get('/users/:identifier', async function name(req: any, res: any) {
        try {
            //check if is email address
            if (
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(
                    req.params.identifier
                )
            ) {
                const user = await getUserByEmail(
                    req.params.identifier,
                    req.get('Authorization')
                )
                if (!user) {
                    throw new Error('No user found')
                }
                res.status(200).send({
                    user: user.clean(['salt', 'hashedPassword']),
                })
            } else {
                //if identifier isn't email address
                const user = await getUserById(req.params.identifier)
                if (!user) {
                    throw new Error('No user found')
                }
                res.status(200).send({
                    user: user.clean(['salt', 'hashedPassword']),
                })
            }
        } catch (error: any) {
            return res.status(403).send({
                message: error.message,
            })
        }
    })
}
