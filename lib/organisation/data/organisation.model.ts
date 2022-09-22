/* organisation.model.ts */

import { BaseModel, BaseModelId } from "../../../lib/models";
import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

//* Organisation model and indexes //

// To get all an organisation by it's ID *//
//namespace organisation:${organisationId} */
export const OrganisationId = buildIndex({ namespace: `organisation`, label: "label1" });

// To get all organsations a user is the owner of *//
//namespace user_${userId}:ownedOrganisations:${organisationId} */
export const OrganisationCreator = (creatorId: string) =>
    buildIndex({
        namespace: `user_${creatorId}:ownedOrganisations`,
        label: "label2",
    });

//model: Organisation */
export class Organisation extends BaseModel<Organisation> {
    type = "Organisation";
    archived: boolean;
    name: string;
    path: string;
    modelKeys() {
        return [
            indexBy(OrganisationId).exact(this.id),
            indexBy(OrganisationCreator(this.createdBy)).exact(this.id),
        ];
    }
}
