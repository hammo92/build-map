/* organisation.model.ts */

import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

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
