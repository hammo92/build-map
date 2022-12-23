/* project.model.ts */
import { BaseModel } from '../../../lib/models'
import { buildIndex, indexBy, Model } from 'serverless-cloud-data-utils'
import { Address } from '../../../types/common'

//* Project model and indexes */

// To get project by id //
//namespace projects:projectId */
export const ProjectId = buildIndex({ namespace: 'projects', label: 'label1' })

// To get project by creator //
//namespace user_${userId}:ownedProjects:${projectId} */
export const ProjectCreator = (creatorId: string) =>
    buildIndex({
        namespace: `user_${creatorId}:ownedProjects`,
        label: 'label2',
    })

// To get project by organisation //
//namespace organisation_${organisationId}:projects:${projectsId} */
export const ProjectOrg = (organisationId: string) =>
    buildIndex({
        namespace: `organisation_${organisationId}:projects`,
        label: 'label3',
    })

//model: Project //
export class Project extends BaseModel<Project> {
    object = 'Project'
    jobNumber: string
    date: string
    organisationId: string
    address: Address
    isActive: boolean
    modelKeys() {
        return [
            indexBy(ProjectId).exact(this.id),
            /*indexBy(ProjectCreator(this.creatorId)).exact(this.id),*/
            indexBy(ProjectOrg(this.organisationId)).exact(this.id),
            //indexBy(ProjectActive).exact(this.isActive),*/
        ]
    }
}

//* ProjectUser model and indexes, used to manage and access members of a project */

// To get projectUser by userId //
//namespace user_${userId}:projects:${projectId} */
export const UserProjects = (userId: string) => {
    return buildIndex({ namespace: `user_${userId}:projects`, label: 'label1' })
}

// To get projectUser by projectId //
//namespace projects_${projectId}:users:${userId} */
export const ProjectUsers = (projectId: string) =>
    buildIndex({
        namespace: `projects_${projectId}:users`,
        label: 'label2',
    })

//model: ProjectUser //
export class ProjectUser extends BaseModel<ProjectUser> {
    object = 'ProjectUser'
    projectId: string
    userId: string
    modelKeys() {
        return [
            indexBy(UserProjects(this.userId)).exact(this.projectId),
            indexBy(ProjectUsers(this.projectId)).exact(this.userId),
        ]
    }
}
