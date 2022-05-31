import { indexBy } from "serverless-cloud-data-utils";
/*import { joinOrganisation } from "../../organisation/data/index";*/
import { v4 as uuidv4, v5 as uuidv5 } from "uuid";
import { createOrganisationtUser } from "../../organisation/data";
//import { createProjectUser } from "../../project/data";
import { USER_UUID_NAMESPACE } from "../../user/data";
import {
    Invitation,
    InvitationCreator,
    InvitationEmail,
    InvitationId,
    InvitationOrganisation,
    InvitationProject,
} from "./invitation.model";
import { User, UserId } from "../../user/data/user.model";

//* Create invitation */
export async function createInvitation({
    email,
    organisationId,
    projectId,
    creatorId,
}: {
    email: string;
    organisationId: string;
    projectId: string;
    creatorId: string;
}) {
    // create invitation
    const newInvitation = new Invitation();
    newInvitation.id = uuidv4();
    newInvitation.email = email;
    newInvitation.organisationId = organisationId;
    newInvitation.date = new Date().toISOString();
    newInvitation.projectId = projectId;
    newInvitation.creatorId = creatorId;
    newInvitation.redeemed = false;
    await newInvitation.save();

    return newInvitation;
}

//* Get invitation by id */
export async function getInvitationById(id: string) {
    const invitation = await indexBy(InvitationId).exact(id).get(Invitation);
    return invitation;
}

//* Get invitations by email */
export async function getInvitationsByEmail(email: string) {
    const invitations = await indexBy(InvitationEmail(email)).get(Invitation);
    return invitations;
}

//* Get invitations by userId */
export async function getinvitationsByUserId(userId: string) {
    const user = await indexBy(UserId).exact(userId).get(User);
    const invitations = await indexBy(InvitationEmail(user.email)).get(
        Invitation
    );
    return invitations;
}

//* Get invitations by organisation */
export async function getInvitationsByOrganisation(organisationId: string) {
    const invitations = await indexBy(
        InvitationOrganisation(organisationId)
    ).get(Invitation);
    return invitations;
}

//* Get invitations by project */
export async function getInvitationsByProject(projectId: string) {
    const invitations = await indexBy(InvitationProject(projectId)).get(
        Invitation
    );
    return invitations;
}

//* Get invitations by creator */
export async function getInvitationsByCreator(creatorId: string) {
    const invitations = await indexBy(InvitationCreator(creatorId)).get(
        Invitation
    );
    return invitations;
}

//* Delete invite by id */
export async function deleteInvitationById(id: string) {
    const invitation = await indexBy(InvitationId).exact(id).get(Invitation);
    await invitation.delete();
    return invitation;
}

//* Redeem invitation by id*/
export async function redeemInvitationById(id: string) {
    const invitation = await indexBy(InvitationId).exact(id).get(Invitation);
    const { organisationId, email, projectId } = invitation;

    // invitation can only be redeemed after sign up, id should be available
    // find id from email
    const userId = await uuidv5(email, USER_UUID_NAMESPACE);

    await createOrganisationtUser({ organisationId, userId });
    // if (invitation.projectId) {
    //     await createProjectUser({ projectId, userId });
    // }
    invitation.redeemed = true;
    await invitation.save();
    return invitation;
}
