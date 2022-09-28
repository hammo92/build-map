import { indexBy } from "serverless-cloud-data-utils";
import { v5 as uuidv5 } from "uuid";
import { addUserToOrganisation } from "../../organisation/data";
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
import { ulid } from "ulid";

//* Create invitation */
export async function createInvitation({
    email,
    organisationId,
    projectId,
    userId,
}: {
    email: string;
    organisationId: string;
    projectId: string;
    userId: string;
}) {
    // create invitation
    const newInvitation = new Invitation({ userId });
    newInvitation.email = email;
    newInvitation.organisationId = organisationId;
    newInvitation.redeemed = false;
    newInvitation.projectId = projectId;
    await newInvitation.save();

    return newInvitation;
}

//* Get invitation by id */
export async function getInvitationById(id: string) {
    const [invitation] = await indexBy(InvitationId).exact(id).get(Invitation);
    return invitation;
}

//* Get invitations by email */
export async function getInvitationsByEmail(email: string) {
    const invitations = await indexBy(InvitationEmail(email)).get(Invitation);
    return invitations;
}

//* Get invitations by userId */
export async function getinvitationsByUserId(userId: string) {
    const [user] = await indexBy(UserId).exact(userId).get(User);
    if (!user) throw new Error("No user found");
    const invitations = await indexBy(InvitationEmail(user.email)).get(Invitation);
    return invitations;
}

//* Get invitations by organisation */
export async function getInvitationsByOrganisation(organisationId: string) {
    const invitations = await indexBy(InvitationOrganisation(organisationId)).get(Invitation);
    return invitations;
}

//* Get invitations by project */
export async function getInvitationsByProject(projectId: string) {
    const invitations = await indexBy(InvitationProject(projectId)).get(Invitation);
    return invitations;
}

//* Get invitations by creator */
export async function getInvitationsByCreator(creatorId: string) {
    const invitations = await indexBy(InvitationCreator(creatorId)).get(Invitation);
    return invitations;
}

//* Delete invite by id */
export async function deleteInvitationById(id: string) {
    const [invitation] = await indexBy(InvitationId).exact(id).get(Invitation);
    if (!invitation) throw new Error("No invitation found");
    await invitation.delete();
    return invitation;
}

//* Redeem invitation by id*/
export async function redeemInvitationById(id: string) {
    const [invitation] = await indexBy(InvitationId).exact(id).get(Invitation);
    if (!invitation) throw new Error("No invitation found");
    const { organisationId, email, projectId } = invitation;

    // invitation can only be redeemed after sign up, id should be available
    // find id from email
    const userId = await uuidv5(email, USER_UUID_NAMESPACE);

    await addUserToOrganisation({ organisationId, userId, role: "owner" });

    //Todo: if project is defined on invitation
    // if (invitation.projectId) {
    //     await createProjectUser({ projectId, userId });
    // }
    invitation.redeemed = true;
    invitation.lastEditedBy = userId;
    invitation.lastEditedTime = new Date().toISOString();
    await invitation.save();
    return invitation;
}
