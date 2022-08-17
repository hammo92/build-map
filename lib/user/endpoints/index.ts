import { api, params } from "@serverless/cloud";
import {
    auth,
    createUser,
    createUserToken,
    deleteUserById,
    getUserByEmail,
    getUserById,
    updateUser,
    verifyToken,
} from "../data/index";
import util from "util";
import crypto from "crypto";
import { ErrorInfo } from "react";

const pbkdf2 = util.promisify(crypto.pbkdf2);

export const users = () => {
    //* Create a user */
    api.post("/users", async function (req: any, res: any) {
        try {
            const user = await createUser(req.body);
            const { id, name, email } = user;
            const token = await createUserToken({ id, name, email });
            res.status(200).send({
                token,
                user,
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error?.message,
            });
        }
    });

    //* Login user */
    api.post("/login", async function (req: any, res: any) {
        try {
            const user = await getUserByEmail(req.body.email);
            if (!user) {
                throw new Error("Email or password is incorrect");
            }
            const { id, name, email } = user;
            // hash password to check against encypted
            const hashedPassword = (
                await pbkdf2(req.body.password, user.salt, 310000, 32, "sha256")
            ).toString();
            // Check if password is correct, throw generic error on fail
            if (
                !crypto.timingSafeEqual(
                    Buffer.from(user.hashedPassword),
                    Buffer.from(hashedPassword.toString())
                )
            ) {
                throw new Error("Email or password is incorrect");
            }
            const token = await createUserToken({ id, name, email });
            res.status(200).send({
                token,
                user,
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error?.message,
            });
        }
    });

    //* Authenticate token for user */
    api.post("/authenticate", async function (req: any, res: any) {
        try {
            if (!req.body.token) {
                throw new Error("No token available");
            }
            req.body.token.replace("Bearer ", "");
            const user = verifyToken(req.body.token);
            res.status(200).send({
                user: user,
            });
        } catch (error) {
            res.status(403).send({
                message: "Invalid authorization token",
            });
        }
    });

    //* root level middleware, runs on every request to the api to authenticate user, runs on everthing but register, login, and authenticate
    api.use(auth());

    //* Get logged in user */
    api.get("/me", async function name(req: any, res: any) {
        try {
            const user = await getUserById(req.user.id);
            res.status(200).send({
                user: user.clean(["salt", "hashedPassword"]),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Update logged in user */
    api.patch("/me", async function name(req: any, res: any) {
        try {
            const user = await updateUser({
                userId: req.user.id,
                ...req.body.userDetails,
            });

            res.status(200).send({
                user: user.clean(["salt", "hashedPassword"]),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Delete logged in user */
    api.delete("/me", async function name(req: any, res: any) {
        try {
            const user = await deleteUserById(req.user.id);
            res.status(200).send({
                user: user.clean(["salt", "hashedPassword"]),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get user by id or email */
    api.get("/users/:identifier", async function name(req: any, res: any) {
        try {
            //check if is email address
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.params.identifier)) {
                const user = await getUserByEmail(req.params.identifier);
                if (!user) {
                    throw new Error("No user found");
                }
                res.status(200).send({
                    user: user.clean(["salt", "hashedPassword"]),
                });
            } else {
                //if identifier isn't email address
                const user = await getUserById(req.params.identifier);
                if (!user) {
                    throw new Error("No user found");
                }
                res.status(200).send({
                    user: user.clean(["salt", "hashedPassword"]),
                });
            }
        } catch (error: any) {
            return res.status(403).send({
                message: error.message,
            });
        }
    });
};
