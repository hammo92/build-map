import { api, data } from '@serverless/cloud'
import { getProjectById } from '../../project/data'
import {
    createContentTemplate,
    deleteContentTemplateById,
    getContentTemplateById,
    getOrganisationContentTemplates,
    updateContentTemplate,
    updateProperties,
    UpdatePropertiesProps,
} from '../data'
import { ContentTemplate } from '../../../lib/contentTemplate/data/contentTemplate.model'
import { objectify } from 'radash'
import { parentIsRepeatable } from '../../../lib/contentTemplate/data/functions/group'

export const contentTemplates = () => {
    //* Create contentTemplate */
    api.post('/contentTemplates', async function (req: any, res: any) {
        const { name, organisationId, icon, templateType } = req.body
        try {
            const { user } = req
            const contentTemplate = await createContentTemplate({
                name,
                organisationId,
                userId: user.id,
                icon,
                templateType,
            })
            return res.status(200).send({
                newContentTemplate: contentTemplate && contentTemplate.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get contentTemplate */
    api.get(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params

            try {
                const contentTemplate = await getContentTemplateById(
                    contentTemplateId
                )
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update contentTemplate  */
    api.patch(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params
            const { name, status, icon, title } = req.body
            const { user } = req
            try {
                const contentTemplate = await updateContentTemplate({
                    contentTemplateId,
                    name,
                    status,
                    icon,
                    title,
                    userId: user.id,
                })
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update contentTemplate Properties */
    api.post(
        `/contentTemplates/:contentTemplateId/properties`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params
            const {
                createdGroups,
                createdProperties,
                deletedGroups,
                deletedProperties,
                updatedGroups,
                updatedProperties,
            } = req.body as UpdatePropertiesProps
            const { user } = req
            try {
                const contentTemplate = await updateProperties({
                    contentTemplateId,
                    createdGroups,
                    createdProperties,
                    deletedGroups,
                    deletedProperties,
                    updatedGroups,
                    updatedProperties,
                    userId: user.id,
                })
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Delete contentTemplate */
    api.delete(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params
            const { user } = req
            try {
                const contentTemplate = await deleteContentTemplateById(
                    contentTemplateId
                )
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Get organsation contentTemplates */
    api.get(
        `/organisations/:organisationId/contentTemplates`,
        async function (req: any, res: any) {
            const organisationId = req.params.organisationId
            const { user } = req
            try {
                const contentTemplates = await getOrganisationContentTemplates(
                    organisationId
                )
                return res.status(200).send({
                    contentTemplates: contentTemplates.length
                        ? contentTemplates.map((contentTemplate) =>
                              contentTemplate.clean()
                          )
                        : [],
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Get organsation contentTemplates */
    api.get(
        `/projects/:projectId/contentTemplates`,
        async function (req: any, res: any) {
            const projectId = req.params.projectId
            const { user } = req

            try {
                const project = await getProjectById(projectId)
                if (!project) throw new Error('project not found')
                const contentTemplates = await getOrganisationContentTemplates(
                    project.organisationId
                )
                return res.status(200).send({
                    contentTemplates: contentTemplates.length
                        ? contentTemplates.map((contentTemplate) =>
                              contentTemplate.clean()
                          )
                        : [],
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
