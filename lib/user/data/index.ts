import { getImageUrl } from "../../../lib/asset/data";
import { params, Request, storage } from "@serverless/cloud";
import crypto from "crypto";
import jwt, { JwtPayload } from "jsonwebtoken";
import { indexBy } from "serverless-cloud-data-utils";
import { CleanedCamel } from "type-helpers";
import util from "util";
import { Required } from "utility-types";
import { v5 as uuidv5 } from "uuid";
import { errorIfUndefined } from "../../utils";
import { User, UserId } from "./user.model";

const pbkdf2 = util.promisify(crypto.pbkdf2);

const TOKEN_SECRET = params.TOKEN_SECRET;

export const USER_UUID_NAMESPACE = "9738E54D-3350-402B-9849-35F0ECEB772C";

export type StrippedUser = Omit<User, "salt" | "hashedPassword">;

//* Create user token */
export async function createUserToken({
    id,
    name,
    email,
}: {
    id: string;
    name: string;
    email: string;
}) {
    return jwt.sign({ id, email, name }, TOKEN_SECRET);
}

//* Verify token */
export function verifyToken(token: string) {
    return jwt.verify(token, TOKEN_SECRET);
}

//* Authenticate user from token */
export function auth() {
    return async function (req: any, res: any, next: any) {
        try {
            const token = req.get("Authorization")?.replace("Bearer ", "");
            //set user in req for below api calls
            req.user = verifyToken(token);
            return next();
        } catch (error) {
            res.status(403).send({
                message: "Invalid authorization token",
            });
        }
    };
}

//* Create user */
export async function createUser({
    email,
    name,
    password,
}: {
    email: string;
    name: string;
    password: string;
}) {
    [email, name, password].forEach((arg) => {
        if (!arg) {
            throw new Error(`${arg} is not defined`);
        }
    });
    errorIfUndefined([email, name, password]);

    //Todo: allow continue and trigger validation email
    // Check email isn't already in use
    const user = await getUserByEmail(email);
    if (user) {
        throw new Error("Unable to complete registration");
    }

    /* Generate unique, non-random ID from email and namespace */
    const id = uuidv5(email, USER_UUID_NAMESPACE);

    /* encrypt password */
    const salt = crypto.randomBytes(16).toString();
    const hashedPassword = (await pbkdf2(password, salt, 310000, 32, "sha256")).toString();

    const newUser = new User();
    newUser.name = name;
    newUser.email = email;
    newUser.nickname = name.split(" ")[0];
    newUser.salt = salt;
    newUser.hashedPassword = hashedPassword;
    await newUser.save();
    return newUser;
}

//* Update user */
export async function updateUser(
    props: Partial<CleanedCamel<User>> & { password?: string; userId: string }
) {
    //remove values that shouldn't be updated, and values which require additional processing

    const { id, hashedPassword, salt, password, name, nickname, userId, ...rest } = props;
    errorIfUndefined([userId]);

    const user = await indexBy(UserId).exact(userId).get(User);
    if (!user) {
        throw new Error("No user exists with provided Id");
    }

    const updatedUser = { ...user, ...rest };

    if (password) {
        /* encrypt password */
        const salt = crypto.randomBytes(16).toString();
        const hashedPassword = (await pbkdf2(password, salt, 310000, 32, "sha256")).toString();
        updatedUser.salt = salt;
        updatedUser.hashedPassword = hashedPassword;
    }

    if (name) {
        updatedUser.name = name;
        if (!user.nicknameManuallySet) {
            updatedUser.nickname = name.split(" ")[0];
        }
    }

    if (nickname) {
        updatedUser.nickname = nickname;
        updatedUser.nicknameManuallySet = true;
    }

    updatedUser.lastEditedBy = userId;
    updatedUser.lastEditedTime = new Date().toISOString();

    await new User({ ...updatedUser }).save();
    return user;
}

//* Get user //
async function getUser(userId: string) {
    const user = await indexBy(UserId).exact(userId).get(User);
    if (user?.picture) {
        const [xs, sm, md, lg, xl, full] = await Promise.all([
            getImageUrl({ imageId: user?.picture, userId, height: 50 }),
            getImageUrl({ imageId: user?.picture, userId, height: 100 }),
            getImageUrl({ imageId: user?.picture, userId, height: 200 }),
            getImageUrl({ imageId: user?.picture, userId, height: 400 }),
            getImageUrl({ imageId: user?.picture, userId, height: 800 }),
            getImageUrl({ imageId: user?.picture, userId }),
        ]);
        user.avatar = { xs, sm, md, lg, xl, full };
    }

    return user;
}

//* Get user by id */
export async function getUserById(userId: string) {
    errorIfUndefined([userId]);
    const user = await getUser(userId);
    return user;
}

//* Delete user by id */
export async function deleteUserById(userId: string) {
    errorIfUndefined([userId]);
    const user = await indexBy(UserId).exact(userId).get(User);
    if (!user) {
        throw new Error("No user exists for this email");
    }
    await user.delete();

    return user;
}

//* Get user by email */
export async function getUserByEmail(userEmail: string) {
    errorIfUndefined([userEmail]);
    const userId = uuidv5(userEmail, USER_UUID_NAMESPACE);
    const user = await getUser(userId);
    return user;
}

//* Get logged in user from token in req header */
export function getUserFromReqAuthHeader(req: Request): string | JwtPayload {
    const token = req.get("Authorization")?.replace("Bearer ", "");
    const user = jwt.verify(token, TOKEN_SECRET);
    if (!user) {
        throw new Error("No user exists for this email");
    }
    return user;
}
