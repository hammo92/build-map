import { api, params } from "@serverless/cloud";
import {
    createOrganisationtUser,
    createOrganisation,
    deleteOrganisationById,
    getOrganisationById,
    getOrganisationOrganisationUsers,
    getOrganisationsByCreator,
    getOrganisationUsers,
    getUserOrganisations,
    removeUserFromOrganisation,
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
    api.get(
        `/organisations/:organisationId`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const organisation = await getOrganisationById(organisationId);
                return res.status(200).send({
                    organisation: organisation && organisation.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update Organisation */
    api.patch(
        `/organisations/:organisationId`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const organisation = await updateOrganisation({
                    organisationId,
                    name: req.body.name,
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
        }
    );

    //* Delete organsation by id */
    api.delete(
        `/organisations/:organisationId`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const organisation = await deleteOrganisationById(
                    organisationId
                );
                return res.status(200).send({
                    organisation: organisation && organisation.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Create organisation user */
    api.post(
        "/organisations/:organisationId/users",
        async function (req: any, res: any) {
            try {
                const organisationUser = await createOrganisationtUser({
                    organisationId: req.params.organisationId,
                    userId: req.body.userId,
                });
                return res.status(200).send({
                    organisationUser:
                        organisationUser && organisationUser.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete organisation user */
    api.delete(
        "/organisations/:organisationId/users",
        async function (req: any, res: any) {
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
        }
    );

    //* Get all users for an organisation */
    api.get(
        `/organisations/:organisationId/users`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const users = await getOrganisationUsers(organisationId);

                return res.status(200).send({
                    users:
                        users.length &&
                        users.map((user) =>
                            user!.clean(["salt", "hashedPassword"])
                        ),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Get all organistaionUsers for an organisation */
    api.get(
        `/organisations/:organisationId/organistaionUsers`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const organisationUsers =
                    await getOrganisationOrganisationUsers(organisationId);
                return res.status(200).send({
                    organisationUsers: organisationUsers.map(
                        (organisationUser) => organisationUser.clean()
                    ),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Get all organisations a user has created */
    api.get(`/me/createdOrganisations`, async function (req: any, res: any) {
        try {
            const { user } = req;
            const organisations = await getOrganisationsByCreator(user.id);
            return res.status(200).send({
                organisations: organisations.map((organisation) =>
                    organisation.clean()
                ),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

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
