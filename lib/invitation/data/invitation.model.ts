/* invitation.model.ts */
import { BaseModel, BaseModelId } from "../../../lib/models";
import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

//* Invitation model and indexes *//

// To get invitation by id //
//namespace invitations:invitationId */
export const InvitationId = buildIndex({ namespace: "invitations" });

// To get invitation by creator //
//namespace user_${userId}:sentInvitations:${invitationId} */
export const InvitationCreator = (creatorId: string) =>
    buildIndex({
        namespace: `user_${creatorId}:sentInvitations`,
        label: "label1",
    });

// To get invitations for organisation //
//namespace org_${organisationId}:invitations:${invitationsId} */
export const InvitationOrganisation = (organisationId: string) =>
    buildIndex({
        namespace: `org_${organisationId}:invitations`,
        label: "label2",
    });

// To get invitations for project //
//namespace project_${projectId}:invitations:${invitationsId} */
export const InvitationProject = (projectId: string) =>
    buildIndex({
        namespace: `project_${projectId}:invitations`,
        label: "label2",
    });

// To get invitations for email //
//namespace email_${invitationEmail}:${invitationId} */
export const InvitationEmail = (invitationEmail: string) =>
    buildIndex({
        namespace: `email${invitationEmail}`,
        label: "label3",
    });

//model: Invitation */
export class Invitation extends BaseModel<Invitation> {
    type = "Invitation";
    email: string;
    organisationId: string;
    projectId?: string;
    redeemed: boolean;
    creatorId: string;
    keys() {
        return [
            indexBy(InvitationId).exact(this.id),
            indexBy(InvitationCreator(this.creatorId)).exact(this.id),
            indexBy(InvitationOrganisation(this.organisationId)).exact(this.id),
            indexBy(InvitationEmail(this.email)).exact(this.id),
            indexBy(BaseModelId).exact(this.id),
        ];
    }
}
