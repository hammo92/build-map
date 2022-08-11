import { params } from "@serverless/cloud";
import axios from "axios";
import { Oso } from "oso-cloud";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { getUserById } from "../../../lib/user/data";
import { errorIfUndefined } from "../../../lib/utils";
import { Address } from "../../../types/common";
import { User, UserId } from "../../user/data/user.model";
import {
    Project,
    ProjectCreator,
    ProjectId,
    ProjectOrg,
    ProjectUser,
    ProjectUsers,
    UserProjects,
} from "./projectModel";
const oso = new Oso("https://cloud.osohq.com", params.OSO_API_KEY);

//* Create project */
export async function createProject({
    name,
    userId,
    organisationId,
    address,
    jobNumber,
}: {
    name: string;
    userId: string;
    organisationId: string;
    address?: Address;
    jobNumber?: string;
}) {
    errorIfUndefined({ name, userId, organisationId });

    const user = await getUserById(userId);
    errorIfUndefined({ user }, "notFound");

    // create project
    const newProject = new Project();

    newProject.name = name;
    newProject.creatorId = userId;
    newProject.organisationId = organisationId;
    if (address) {
        newProject.address = address;
    }
    if (jobNumber) {
        newProject.jobNumber = jobNumber;
    }
    newProject.id = ulid();
    newProject.date = new Date().toISOString();
    newProject.isActive = true;

    // find postcode coordinates if only postcode provided
    if (address?.postcode && (!address?.latitude || !address?.longitude)) {
        const {
            data: {
                result: { latitude, longitude },
            },
        } = await axios.get(`https://api.postcodes.io/postcodes/${address.postcode}`);
        newProject.address.latitude = latitude;
        newProject.address.longitude = longitude;
    }

    // create projectUser for creator
    const newProjectUser = new ProjectUser();
    newProjectUser.projectId = newProject.id;
    newProjectUser.userId = userId;
    newProjectUser.roleId = "none";
    await Promise.all([
        //oso.addRole(user, "writer", newProject),
        newProject.save(),
        newProjectUser.save(),
    ]);
    return newProject;
}

//* Get project by id */
export async function getProjectById(id: string) {
    const project = await indexBy(ProjectId).exact(id).get(Project);
    return project;
}

//* Update project */
export async function updateProject({
    projectId,
    name,
    address,
}: {
    projectId: string;
    name?: string;
    address?: Address;
}) {
    errorIfUndefined({ projectId });
    const project = await indexBy(ProjectId).exact(projectId).get(Project);
    if (!project) {
        throw new Error("No project found");
    }
    project.name = name ?? project.name;
    project.address = address ?? project.address;

    // find postcode coordinates postcode updated, and no new coordinates provided
    if (address?.postcode && (!address?.latitude || !address?.longitude)) {
        const {
            data: {
                result: { latitude, longitude },
            },
        } = await axios.get(`https://api.postcodes.io/postcodes/${address.postcode}`);
        project.address.latitude = latitude;
        project.address.longitude = longitude;
    }

    await project.save();
    return project;
}

//* Delete project by id */
export async function deleteProjectById(projectId: string) {
    errorIfUndefined({ projectId });
    // get project
    const project = await indexBy(ProjectId).exact(projectId).get(Project);
    errorIfUndefined({ project }, "notFound");

    // get all ProjectUsers
    const projectUsers = (await indexBy(ProjectUsers(projectId)).get(ProjectUser)) ?? [];

    const deleteUserPromises = projectUsers.flatMap((projectUser) => {
        const deleteUserPromise = projectUser.delete();
        /*const removePermissionPromise = oso.deleteRole(
            new User({ id: projectUser.userId }),
            "writer",
            project!
        );*/
        return [deleteUserPromise];
    });
    console.log("deleteUserPromises", deleteUserPromises);
    // delete project and projectUsers
    await Promise.all([...deleteUserPromises, project!.delete()]);

    return project;
}

//* Get all projects created by a user */
export async function getProjectsByCreator(ownerId: string) {
    errorIfUndefined({ ownerId });
    const projects = await indexBy(ProjectCreator(ownerId)).get(Project);
    return projects;
}

//* Get all projects for an organisation */
export async function getProjectsByOrgId(organisationId: string) {
    errorIfUndefined({ organisationId });
    const projects = await indexBy(ProjectOrg(organisationId)).get(Project);
    return projects;
}

//* Create project user */
export async function createProjectUser({
    projectId,
    userId,
}: {
    projectId: string;
    userId: string;
}) {
    errorIfUndefined({ projectId, userId });
    // create organisationUser for creator
    const newProjectUser = new ProjectUser();
    newProjectUser.projectId = projectId;
    newProjectUser.userId = userId;
    newProjectUser.roleId = "none";
    await newProjectUser.save();
    return newProjectUser;
}

//* Delete project user */
export async function removeUserFromProject({
    projectId,
    userId,
}: {
    projectId: string;
    userId: string;
}) {
    errorIfUndefined({ projectId, userId });
    const projectUser = await indexBy(UserProjects(userId)).exact(projectId).get(ProjectUser);
    if (!projectUser) {
        throw new Error("No user found");
    }
    await projectUser.delete();
    return projectUser;
}

//* Get all projectUsers for a user */
export async function getUserProjectUsers(userId: string) {
    errorIfUndefined({ userId });
    const projectUsers = await indexBy(UserProjects(userId)).get(ProjectUser);
    return projectUsers;
}

//* Get all projects for a user */
export async function getUserProjects(userId: string) {
    /*const canRead = await oso.list(new User({ id: userId }), "read", "Project"!);*/

    errorIfUndefined({ userId });
    const projectUsers = await indexBy(UserProjects(userId)).get(ProjectUser);
    const projects = await Promise.all(
        projectUsers.map(
            async ({ projectId }) => await indexBy(ProjectId).exact(projectId).get(Project)
        )
    );
    return projects;
}

//* Get all projectUsers for a project */
export async function getProjectProjectUsers(projectId: string) {
    errorIfUndefined({ projectId });
    const projectUsers = await indexBy(ProjectUsers(projectId)).get(ProjectUser);
    return projectUsers;
}

//* Get all users for a project */
export async function getProjectUsers(projectId: string) {
    errorIfUndefined({ projectId });
    const projectUsers = await indexBy(ProjectUsers(projectId)).get(ProjectUser);
    const users = await Promise.all(
        projectUsers.map(async ({ userId }) => {
            const user = await indexBy(UserId).exact(userId).get(User);
            return user;
        })
    );
    return users;
}
