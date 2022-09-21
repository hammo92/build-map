/* project.model.ts */
import { BaseModel, BaseModelId } from "../../../lib/models";
import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";
import { Address } from "../../../types/common";

//* Project model and indexes */

// To get project by id //
//namespace projects:projectId */
export const ProjectId = buildIndex({ namespace: "projects" });

// To get project by creator //
//namespace user_${userId}:ownedProjects:${projectId} */
export const ProjectCreator = (creatorId: string) =>
    buildIndex({
        namespace: `user_${creatorId}:ownedProjects`,
        label: "label1",
    });

// To get project by organisation //
//namespace org_${organisationId}:projects:${projectsId} */
export const ProjectOrg = (organisationId: string) =>
    buildIndex({
        namespace: `org_${organisationId}:projects`,
        label: "label2",
    });

//model: Project //
export class Project extends BaseModel<Project> {
    type = "Project";
    jobNumber: string;
    name: string;
    date: string;
    organisationId: string;
    address: Address;
    isActive: boolean;
    keys() {
        return [
            indexBy(ProjectId).exact(this.id),
            /*indexBy(ProjectCreator(this.creatorId)).exact(this.id),
            indexBy(ProjectOrg(this.organisationId)).exact(this.id),
            indexBy(ProjectActive).exact(this.isActive),*/
        ];
    }
}

//* ProjectUser model and indexes, used to manage and access members of a project */

// To get projectUser by userId //
//namespace user_${userId}:projects:${projectId} */
export const UserProjects = (userId: string) => {
    return buildIndex({ namespace: `user_${userId}:projects` });
};

// To get projectUser by projectId //
//namespace projects_${projectId}:users:${userId} */
export const ProjectUsers = (projectId: string) =>
    buildIndex({
        namespace: `projects_${projectId}:users`,
        label: "label1",
    });

//model: ProjectUser //
export class ProjectUser extends BaseModel<ProjectUser> {
    type = "User";
    projectId: string;
    userId: string;
    keys() {
        return [
            indexBy(UserProjects(this.userId)).exact(this.projectId),
            indexBy(ProjectUsers(this.projectId)).exact(this.userId),
        ];
    }
}
