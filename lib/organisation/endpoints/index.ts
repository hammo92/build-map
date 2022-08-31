import { api } from "@serverless/cloud";
import {
    createOrganisation,
    deleteOrganisationById,
    getOrganisationById,
    getOrganisationUsers,
    getUserOrganisations,
    updateOrganisation,
} from "../data/index";

export const organisations = () => {
    //* Create organisation */
    api.post("/organisations", async function (req: any, res: any) {
        try {
            const { user } = req;
            const organisation = await createOrganisation({
                name: req.body.name,
                userId: user.id,
            });
            return res.status(200).send({
                organisation: organisation && organisation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get organsation by id */
    api.get(`/organisations/:organisationId`, async function (req: any, res: any) {
        try {
            const organisationId = req.params.organisationId;
            const { user } = req;
            const organisation = await getOrganisationById({ organisationId, userId: user.id });
            return res.status(200).send({
                organisation: organisation && organisation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Update Organisation */
    api.patch(`/organisations/:organisationId`, async function (req: any, res: any) {
        try {
            const organisationId = req.params.organisationId;
            const { user } = req;
            const organisation = await updateOrganisation({
                organisationId,
                name: req.body.name,
                userId: user.id,
            });
            return res.status(200).send({
                organisation: organisation && organisation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Delete organsation by id */
    api.delete(`/organisations/:organisationId`, async function (req: any, res: any) {
        try {
            const organisationId = req.params.organisationId;
            const organisation = await deleteOrganisationById(organisationId);
            return res.status(200).send({
                organisation: organisation && organisation.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Create organisation user */
    /*api.post("/organisations/:organisationId/users", async function (req: any, res: any) {
        try {
            const organisationUser = await addUserToOrganisation({
                organisationId: req.params.organisationId,
                userId: req.body.userId,
            });
            return res.status(200).send({
                organisationUser: organisationUser && organisationUser.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });*/

    //* Delete organisation user */
    /*api.delete("/organisations/:organisationId/users", async function (req: any, res: any) {
        try {
            const user = await removeUserFromOrganisation({
                organisationId: req.params.organisationId,
                userId: req.body.userId,
            });
            return res.status(200).send({
                removed: user && user.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });*/

    //* Get all users for an organisation */
    api.get(`/organisations/:organisationId/users`, async function (req: any, res: any) {
        try {
            const organisationId = req.params.organisationId;
            const usersAndRoles = await getOrganisationUsers(organisationId);

            return res.status(200).send({
                usersAndRoles:
                    usersAndRoles.length &&
                    usersAndRoles.map(({ user, role }) => ({
                        user: user!.clean(["salt", "hashedPassword"]),
                        role,
                    })),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get all organisationUsers for an organisation */
    /*api.get(
        `/organisations/:organisationId/organisationUsers`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const organisationUsers = await getOrganisationOrganisationUsers(organisationId);
                return res.status(200).send({
                    organisationUsers: organisationUsers.map((organisationUser) =>
                        organisationUser.clean()
                    ),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );*/

    //* Get all organisations a user is a member of */
    api.get(`/me/organisations`, async function (req: any, res: any) {
        try {
            const { user } = req;
            const organisations = await getUserOrganisations(user.id);
            return res.status(200).send({
                organisations:
                    organisations.length &&
                    organisations.map((organisation) => organisation!.clean()),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });
};
