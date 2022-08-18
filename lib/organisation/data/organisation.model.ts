/* organisation.model.ts */

import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";
import slugify from "slugify";

//* Organisation model and indexes //

// To get all an organisation by it's ID *//
//namespace organisation:${organisationId} */
export const OrganisationId = buildIndex({ namespace: `organisation` });

// To get all organsations a user is the owner of *//
//namespace user_${userId}:ownedOrganisations:${organisationId} */
export const OrganisationCreator = (creatorId: string) =>
    buildIndex({
        namespace: `user_${creatorId}:ownedOrganisations`,
        label: "label1",
    });

//model: Organisation */
export class Organisation extends Model<Organisation> {
    id: string;
    type = "Organisation";
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    archived: boolean;
    name: string;
    path: string;
    keys() {
        return [
            indexBy(OrganisationId).exact(this.id),
            indexBy(OrganisationCreator(this.createdBy)).exact(this.id),
        ];
    }
}

//* OrganisationUser model and indexes, used to manage and access members of a organisation */

// To get all organsations a user is a member of *//
//namespace user_${userId}:organisations:${organisationId} */
export const UserOrganisations = (userId: string) => {
    return buildIndex({ namespace: `user_${userId}:organisations` });
};

// To get all users who are members of an organisation *//
//namespace organisation_${organisationId}:users:${userId} */
export const OrganisationUsers = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:users`,
        label: "label1",
    });

//model: OrganisationUser */
export class OrganisationUser extends Model<OrganisationUser> {
    organisationId: string;
    createdTime: string;
    createdBy: string;
    lastEditedTime: string;
    lastEditedBy: string;
    userId: string;
    roleId: string;
    keys() {
        return [
            indexBy(UserOrganisations(this.userId)).exact(this.organisationId),
            indexBy(OrganisationUsers(this.organisationId)).exact(this.userId),
        ];
    }
}
