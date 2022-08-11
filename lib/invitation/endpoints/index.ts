import { api } from "@serverless/cloud";
import { v5 as uuidv5 } from "uuid";
import { getUserOrganisationUsers } from "../../organisation/data";
import { USER_UUID_NAMESPACE } from "../../user/data/index";
import {
    createInvitation,
    deleteInvitationById,
    getInvitationById,
    getInvitationsByCreator,
    getInvitationsByEmail,
    getInvitationsByOrganisation,
    getInvitationsByProject,
    getinvitationsByUserId,
    redeemInvitationById,
} from "../data";

export const invitations = () => {
    //* create invitation */
    api.post(`/invitations`, async function (req: any, res: any) {
        try {
            const { user } = req;

            // check user not already in Org
            const inviteeId = await uuidv5(req.body.email, USER_UUID_NAMESPACE);
            const userOrganisations = await getUserOrganisationUsers(inviteeId);
            const alreadyMember = userOrganisations.some(
                ({ organisationId }) => organisationId === req.body.organisationId
            );
            if (alreadyMember) {
                throw new Error("User is already in organisation");
            }

            //create invitation
            const invitation = await createInvitation({
                email: req.body.email,
                organisationId: req.body.organisationId,
                projectId: req.body.projectId,
                userId: user.id,
            });

            return res.status(200).send({
                invitation: invitation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get invitation by id */
    api.get("/invitations/:id", async function name(req: any, res: any) {
        try {
            const invitation = await getInvitationById(req.params.id);
            res.status(200).send({
                invitation: invitation && invitation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Delete invitation by id */
    api.delete("/invitations/:id", async function name(req: any, res: any) {
        try {
            const invitation = await deleteInvitationById(req.params.id);
            res.status(200).send({
                invitation: invitation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get invitation by user id or email */
    api.get("/invitations/user/:identifier", async function name(req: any, res: any) {
        try {
            // check if identifier is email address
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(req.params.identifier)) {
                const invitations = await getInvitationsByEmail(req.params.identifier);
                res.status(200).send({
                    invitations: invitations.map((invitation) => invitation.clean()),
                });
            } else {
                //if identifier isn't email address
                const invitations = await getinvitationsByUserId(req.params.identifier);
                res.status(200).send({
                    invitations: invitations.map((invitation) => invitation.clean()),
                });
            }
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get invitation by organisation id */
    api.get("/organisations/:organisation/invitations", async function name(req: any, res: any) {
        try {
            const invitations = await getInvitationsByOrganisation(req.params.organisationId);
            res.status(200).send({
                invitations: invitations.map((invitation) => invitation.clean()),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get invitation by project id */
    api.get("/projects/:projectId/invitations", async function name(req: any, res: any) {
        try {
            const invitations = await getInvitationsByProject(req.params.projectId);
            res.status(200).send({
                invitations: invitations.map((invitation) => invitation.clean()),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get my invitations */
    api.get("/me/invitations", async function name(req: any, res: any) {
        try {
            const invitations = await getinvitationsByUserId(req.user.id);
            res.status(200).send({
                invitations: invitations.map((invitation) => invitation.clean()),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get my createdInvitations */
    api.get("/me/createdInvitations", async function name(req: any, res: any) {
        try {
            const invitations = await getInvitationsByCreator(req.user.id);
            res.status(200).send({
                invitations: invitations.map((invitation) => invitation.clean()),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Redeem invitation */
    api.get("/invitations/:invitationId/redeem", async function name(req: any, res: any) {
        try {
            const invitation = await redeemInvitationById(req.params.invitationId);
            res.status(200).send({
                invitation: invitation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });
};
