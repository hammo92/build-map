import { api } from '@serverless/cloud'
import {
    createProjectUser,
    createProject,
    deleteProjectById,
    getProjectById,
    getProjectsByCreator,
    getProjectsByOrgId,
    getProjectUsers,
    getUserProjects,
    removeUserFromProject,
    updateProject,
} from '../data/index'

export const projects = () => {
    //* Create project */
    api.post('/projects', async function (req: any, res: any) {
        try {
            const { user } = req
            const project = await createProject({
                ...req.body,
                userId: user.id,
            })
            return res.status(200).send({
                project: project && project.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get project by id */
    api.get(`/projects/:projectId`, async function (req: any, res: any) {
        try {
            const { user } = req
            const projectId = req.params.projectId
            const project = await getProjectById({ projectId, userId: user.id })
            return res.status(200).send({
                project: project && project.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Update Project */
    api.patch(`/projects/:projectId`, async function (req: any, res: any) {
        try {
            const projectId = req.params.projectId
            const project = await updateProject({
                projectId,
                name: req.body.name,
                address: req.body.address,
            })
            return res.status(200).send({
                project: project && project.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Delete project by id */
    api.delete(`/projects/:projectId`, async function (req: any, res: any) {
        try {
            const projectId = req.params.projectId
            const project = await deleteProjectById(projectId)
            return res.status(200).send({
                project: project && project.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get all projects created by logged in user */
    api.get(`/me/createdProjects/`, async function (req: any, res: any) {
        try {
            const { user } = req
            const projects = await getProjectsByCreator(user.id)
            return res.status(200).send({
                projects:
                    projects && projects.map((project) => project.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get all projects for an organisation */
    api.get(
        `/organisation/:organisationId/projects`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId
                const projects = await getProjectsByOrgId(organisationId)
                return res.status(200).send({
                    projects:
                        projects && projects.map((project) => project.clean()),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Get all projects for logged in User */
    api.get(`/me/projects`, async function (req: any, res: any) {
        try {
            const { user } = req
            const projects = await getUserProjects(user.id)
            // map projectUser entries to return all projects for user
            return res.status(200).send({
                projects:
                    Array.isArray(projects) &&
                    projects.map((project) => project!.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Create project user */
    api.post(`/projects/:projectId/users`, async function (req: any, res: any) {
        try {
            const projectUser = await createProjectUser({
                projectId: req.params.projectId,
                userId: req.body.userId,
            })
            return res.status(200).send({
                projectUser: projectUser && projectUser.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* get users for project */
    api.get(`/projects/:projectId/users`, async function (req: any, res: any) {
        try {
            const users = await getProjectUsers(req.params.projectId)
            return res.status(200).send({
                users:
                    users.length &&
                    users.map((user) =>
                        user!.clean(['hashedPassword', 'salt'])
                    ),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Delete project user */
    api.delete(
        '/projects/:projectId/users',
        async function (req: any, res: any) {
            try {
                const projectUser = await removeUserFromProject({
                    projectId: req.params.projectId,
                    userId: req.body.userId,
                })
                return res.status(200).send({
                    projectUser: projectUser && projectUser.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )
}
