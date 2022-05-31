import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

//* User model and indexes *//

// To get user by id //
//namespace users:${userId} */
export const UserId = buildIndex({ namespace: `user` });

//model: User */
export class User extends Model<User> {
    id: string;
    email: string;
    name: string;
    picture: string;
    hashedPassword: string;
    emailVerified: boolean;
    nickname: string;
    nicknameManuallySet: boolean;
    salt: string;
    keys() {
        return [indexBy(UserId).exact(this.id)];
    }
}
