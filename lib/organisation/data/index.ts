import { indexBy } from "serverless-cloud-data-utils";
import { getUserById } from "../../user/data";
import { User, UserId } from "../../user/data/user.model";
import { errorIfUndefined } from "../../utils";
import { Organisation, OrganisationId } from "./organisation.model";

import { params } from "@serverless/cloud";
import { Oso, Fact } from "oso-cloud";
import { ulid } from "ulid";
import { objArrToKeyIndexedMap } from "utils/arrayModify";
const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

export type OrganisationRoles = "member" | "admin" | "owner";

//* Create organisation */
export async function createOrganisation({ name, userId }: { name: string; userId: string }) {
    errorIfUndefined({ name, userId });
    const user = await getUserById(userId);
    errorIfUndefined({ user }, "notFound");
    // create organisation
    const newOrganisation = new Organisation({ userId });
    newOrganisation.name = name;
    newOrganisation.archived = false;

    await Promise.all([
        oso.tell("has_role", user!, "owner", newOrganisation),
        newOrganisation.save(),
    ]);

    return newOrganisation;
}

//* Get organisation by id */
export async function getOrganisationById({
    organisationId,
    userId,
}: {
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ organisationId, userId });

    // check user has permission to read organisation
    if (
        !(await oso.authorize(
            new User({ id: userId }),
            "read",
            new Organisation({
                id: organisationId,
            })
        ))
    ) {
        throw new Error("You don's have access to this organisation");
    }

    const organisation = await indexBy(OrganisationId).exact(organisationId).get(Organisation);
    return organisation;
}

//* Delete organisation by id */
export async function deleteOrganisationById(organisationId: string) {
    errorIfUndefined({ organisationId });
    // get organisation
    const organisation = await indexBy(OrganisationId).exact(organisationId).get(Organisation);

    // delete organisation
    await Promise.all([organisation && organisation.delete()]);

    return organisation;
}

//* Update organisation */
export async function updateOrganisation({
    organisationId,
    name,
    userId,
}: {
    organisationId: string;
    name?: string;
    userId: string;
}) {
    errorIfUndefined({ organisationId });

    // check user has permission to delete organisation
    if (
        !(await oso.authorize(
            new User({ id: userId }),
            "delete",
            new Organisation({
                id: organisationId,
            })
        ))
    ) {
        throw new Error("You don't have the correct permission to delete this organisation");
    }

    const organisation = await indexBy(OrganisationId).exact(organisationId).get(Organisation);

    errorIfUndefined({ organisation }, "notFound");

    if (name) {
        organisation!.name = name;
    }

    await organisation!.save();
    return organisation;
}

//* Add user to an organisation */
export async function addUserToOrganisation({
    organisationId,
    userId,
    role = "member",
}: {
    organisationId: string;
    userId: string;
    role?: OrganisationRoles;
}) {
    errorIfUndefined({ organisationId, userId });

    await oso.tell(
        "has_role",
        new User({ id: userId }),
        role,
        new Organisation({
            id: organisationId,
        })
    );
}

//* Check if user is in an Organisation */
export async function checkUserInOrganisation({
    organisationId,
    userId,
}: {
    organisationId: string;
    userId: string;
}) {
    errorIfUndefined({ organisationId, userId });

    const inOrganisation = await oso.authorize(
        new User({ id: userId }),
        "read",
        new Organisation({ id: organisationId })
    );
    return inOrganisation;
}

//* Get all users for an organisation */
export async function getOrganisationUsers(organisationId: string) {
    errorIfUndefined({ organisationId });

    const authorisedUsers = await oso.get("has_role", null, null, {
        type: "Organisation",
        id: organisationId,
    });

    const users = await Promise.all(
        authorisedUsers.map((fact) => {
            const [_, userInstance, role] = fact;
            const { id } = userInstance as { id: string };
            return indexBy(UserId).exact(id).get(User);
        })
    );

    const usersMap = users.reduce<{ [key: string]: User }>((acc, user) => {
        if (user) {
            return { ...acc, [user.id]: user };
        }
        return acc;
    }, {});

    const usersAndRoles = authorisedUsers.map((fact) => {
        const [_, userInstance, role] = fact;
        const { id } = userInstance as { id: string };
        return { user: usersMap[id], role: role as OrganisationRoles };
    });

    return usersAndRoles;
}

//* Get all organisations a user is a member of */
export async function getUserOrganisations(userId: string) {
    errorIfUndefined({ userId });

    console.log("userId", userId);

    const authorisedOrganisations = await oso.list(
        new User({ id: userId }),
        "read",
        "Organisation"
    );

    console.log("authorisedOrganisations", authorisedOrganisations);

    /** test get users for org */
    const org = new Organisation({
        id: authorisedOrganisations[0],
    });
    console.log("org", org);
    const authorisedUsers = await oso.get("has_role", null, "owner", org);

    console.log("authorisedUsers", authorisedUsers);
    /** */

    const organisations = await Promise.all(
        authorisedOrganisations.map((organisationId) =>
            indexBy(OrganisationId).exact(organisationId).get(Organisation)
        )
    );

    return organisations;
}
