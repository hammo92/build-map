import { BaseModel, BaseModelId } from "../../../lib/models";
import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

//* User model and indexes *//

// To get user by id //
//namespace users:${userId} */
export const UserId = buildIndex({ namespace: `user`, label: "label1" });

//model: User */
export class User extends BaseModel<User> {
    type = "User";
    email: string;
    name: string;
    picture: string;
    hashedPassword: string;
    emailVerified: boolean;
    nickname: string;
    nicknameManuallySet: boolean;
    salt: string;
    // set on response
    avatar: {
        [key in "xs" | "sm" | "md" | "lg" | "xl" | "full" | string]: string;
    };
    modelKeys() {
        return [indexBy(UserId).exact(this.id)];
    }
}
