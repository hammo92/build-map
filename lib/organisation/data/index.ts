import { getUserById } from "../../user/data";
import { errorIfUndefined } from "../../utils";
import { indexBy } from "serverless-cloud-data-utils";
import { v4 as uuidv4 } from "uuid";
import { User, UserId } from "../../user/data/user.model";
import {
    Organisation,
    OrganisationCreator,
    OrganisationId,
    OrganisationUser,
    OrganisationUsers,
    UserOrganisations,
} from "./organisation.model";

import { Oso } from "oso-cloud";
import { params } from "@serverless/cloud";
const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create organisation */
export async function createOrganisation({
    name,
    userId,
}: {
    name: string;
    userId: string;
}) {
    errorIfUndefined({ name, userId });
    const user = await getUserById(userId);
    errorIfUndefined({ user }, "notFound");
    // create organisation
    const newOrganisation = new Organisation();
    newOrganisation.name = name;
    newOrganisation.id = uuidv4();
    newOrganisation.date = new Date().toISOString();
    newOrganisation.creatorId = userId;

    //create organisationUser for creator
    const newOrganisationUser = new OrganisationUser();
    newOrganisationUser.organisationId = newOrganisation.id;
    newOrganisationUser.userId = userId;
    newOrganisationUser.roleId = "none";

    await Promise.all([
        oso.addRole(user, "owner", newOrganisation),
        newOrganisation.save(),
        newOrganisationUser.save(),
    ]);

    return newOrganisation;
}

//* Get organisation by id */
export async function getOrganisationById(organisationId: string) {
    errorIfUndefined({ organisationId });
    const organisation = await indexBy(OrganisationId)
        .exact(organisationId)
        .get(Organisation);
    return organisation;
}

//* Delete organisation by id */
export async function deleteOrganisationById(organisationId: string) {
    errorIfUndefined({ organisationId });
    // get organisation
    const organisation = await indexBy(OrganisationId)
        .exact(organisationId)
        .get(Organisation);

    // get all OrganisationUsers
    const organistionUsers =
        (await indexBy(OrganisationUsers(organisationId)).get(
            OrganisationUser
        )) ?? [];

    // delete organisation and users
    await Promise.all([
        ...organistionUsers.map(
            async (organistionUser) => await organistionUser.delete()
        ),
        organisation && organisation.delete(),
    ]);

    return organisation;
}

//* Update organisation */
export async function updateOrganisation({
    organisationId,
    name,
}: {
    organisationId: string;
    name?: string;
}) {
    errorIfUndefined({ organisationId });
    const organisation = await indexBy(OrganisationId)
        .exact(organisationId)
        .get(Organisation);

    errorIfUndefined({ organisation }, "notFound");

    if (name) {
        organisation!.name = name;
    }
    await organisation!.save();
    return organisation;
}

//* Get all organisations created by a user */
export async function getOrganisationsByCreator(ownerId: string) {
    errorIfUndefined({ ownerId });
    const organisations = await indexBy(OrganisationCreator(ownerId)).get(
        Organisation
    );
    return organisations;
}

//* Create organisation user */
export async function createOrganisationtUser({
    organisationId,
    userId,
}: {
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ organisationId, userId });
    // create organisationUser for creator
    const newOrganisationUser = new OrganisationUser();
    newOrganisationUser.organisationId = organisationId;
    newOrganisationUser.userId = userId;
    newOrganisationUser.roleId = "none";
    await newOrganisationUser.save();
    return newOrganisationUser;
}

//* Get all users for an organisation */
export async function getOrganisationUsers(organisationId: string) {
    errorIfUndefined({ organisationId });
    const organisationUsers = await indexBy(
        OrganisationUsers(organisationId)
    ).get(OrganisationUser);
    const users = await Promise.all(
        organisationUsers.map(async ({ userId }) => {
            const user = await indexBy(UserId).exact(userId).get(User);
            return user;
        })
    );
    return users;
}

//* Get all organisationUsers for an organisation */
export async function getOrganisationOrganisationUsers(organisationId: string) {
    errorIfUndefined({ organisationId });
    const organisationUsers = await indexBy(
        OrganisationUsers(organisationId)
    ).get(OrganisationUser);
    return organisationUsers;
}

//* Get all organisationUsers for a user */
export async function getUserOrganisationUsers(userId: string) {
    errorIfUndefined({ userId });
    const organisationUsers = await indexBy(UserOrganisations(userId)).get(
        OrganisationUser
    );
    return organisationUsers;
}

//* Get all organisations a user is a member of */
export async function getUserOrganisations(userId: string) {
    errorIfUndefined({ userId });
    const userOrganisationUserEntries = await getUserOrganisationUsers(userId);
    const organisations = await Promise.all(
        userOrganisationUserEntries.map(({ organisationId }) =>
            getOrganisationById(organisationId)
        )
    );
    return organisations;
}

//* Delete organisation user */
export async function removeUserFromOrganisation({
    organisationId,
    userId,
}: {
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ organisationId, userId });
    const user = await indexBy(UserOrganisations(userId))
        .exact(organisationId)
        .get(OrganisationUser);

    errorIfUndefined({ user }, "notFound");
    await user!.delete();
    return user;
}
