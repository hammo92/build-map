import { getProjectById } from "../../project/data";
import { api, params } from "@serverless/cloud";
import snakecaseKeys from "snakecase-keys";
import {
    createContentTemplate,
    createProperty,
    createPropertyGroup,
    deleteContentTemplateById,
    deleteProperty,
    deletePropertyGroup,
    getContentTemplateById,
    getOrganisationContentTemplates,
    reorderProperties,
    updateContentTemplate,
    updateProperty,
    updatePropertyGroup,
    reorderPropertyGroups,
} from "../data";

export const contentTemplates = () => {
    //* Create contentTemplate */
    api.post("/contentTemplates", async function (req: any, res: any) {
        const { name, organisationId, icon, templateType } = req.body;
        try {
            const { user } = req;
            const contentTemplate = await createContentTemplate({
                name,
                organisationId,
                userId: user.id,
                icon,
                templateType,
            });
            return res.status(200).send({
                newContentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get contentTemplate */
    api.get(`/contentTemplates/:contentTemplateId`, async function (req: any, res: any) {
        const { contentTemplateId } = req.params;

        try {
            const contentTemplate = await getContentTemplateById(contentTemplateId);
            return res.status(200).send({
                contentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Update contentTemplate  */
    api.patch(`/contentTemplates/:contentTemplateId`, async function (req: any, res: any) {
        const { contentTemplateId } = req.params;
        const { name, status, icon, title } = req.body;
        const { user } = req;
        try {
            const contentTemplate = await updateContentTemplate({
                contentTemplateId,
                name,
                status,
                icon,
                title,
                userId: user.id,
            });
            return res.status(200).send({
                contentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Delete contentTemplate */
    api.delete(`/contentTemplates/:contentTemplateId`, async function (req: any, res: any) {
        const { contentTemplateId } = req.params;
        const { user } = req;
        try {
            const contentTemplate = await deleteContentTemplateById(contentTemplateId);
            return res.status(200).send({
                contentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get organsation contentTemplates */
    api.get(`/organisations/:organisationId/contentTemplates`, async function (req: any, res: any) {
        const organisationId = req.params.organisationId;
        const { user } = req;
        try {
            const contentTemplates = await getOrganisationContentTemplates(organisationId);
            return res.status(200).send({
                contentTemplates: contentTemplates.length
                    ? contentTemplates.map((contentTemplate) => contentTemplate.clean())
                    : [],
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get organsation contentTemplates */
    api.get(`/projects/:projectId/contentTemplates`, async function (req: any, res: any) {
        const projectId = req.params.projectId;
        const { user } = req;

        try {
            const project = await getProjectById(projectId);
            if (!project) throw new Error("project not found");
            const contentTemplates = await getOrganisationContentTemplates(project.organisationId);
            return res.status(200).send({
                contentTemplates: contentTemplates.length
                    ? contentTemplates.map((contentTemplate) => contentTemplate.clean())
                    : [],
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Create contentTemplate Property */
    api.post("/contentTemplates/:contentTemplateId/fields", async function (req: any, res: any) {
        const { fieldProperties, groupId } = req.body;
        const { contentTemplateId } = req.params;
        const { user } = req;
        try {
            const { contentTemplate, property } = await createProperty({
                contentTemplateId,
                fieldProperties,
                userId: user.id,
                groupId,
            });
            return res.status(200).send({
                contentTemplate: contentTemplate && contentTemplate.clean(),
                property: property && property,
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Update contentTemplate Property */
    api.patch(
        "/contentTemplates/:contentTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { fieldProperties } = req.body;
            const { contentTemplateId, fieldId } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await updateProperty({
                    contentTemplateId,
                    fieldProperties,
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Create contentTemplate Property Group */
    api.post(
        "/contentTemplates/:contentTemplateId/propertyGroups",
        async function (req: any, res: any) {
            const { name, parentId } = req.body;
            const { contentTemplateId } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await createPropertyGroup({
                    contentTemplateId,
                    name,
                    parentId,
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Rorder Property Groups/Properties */
    api.patch(
        "/contentTemplates/:contentTemplateId/propertyGroups",
        async function (req: any, res: any) {
            const { source, destination } = req.body;
            const { contentTemplateId } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await reorderPropertyGroups({
                    contentTemplateId,
                    userId: user.id,
                    source,
                    destination,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update contentTemplate Property Group */
    api.post(
        "/contentTemplates/:contentTemplateId/propertyGroup/:propertyGroupId",
        async function (req: any, res: any) {
            const { name, repeatable } = req.body;
            const { contentTemplateId, propertyGroupId } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await updatePropertyGroup({
                    contentTemplateId,
                    propertyGroupId,
                    name,
                    repeatable,
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete contentTemplate Property Group */
    api.delete(
        "/contentTemplates/:contentTemplateId/propertyGroup/:groupId-:deleteContents",
        async function (req: any, res: any) {
            const { contentTemplateId, groupId, deleteContents } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await deletePropertyGroup({
                    contentTemplateId,
                    groupId,
                    deleteContents: deleteContents === "true",
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Reorder contentTemplate Property */
    api.post(
        "/contentTemplates/:contentTemplateId/reorderFields",
        async function (req: any, res: any) {
            const { fromIndex, toIndex } = req.body;
            const { contentTemplateId } = req.params;
            const { user } = req;
            try {
                const contentTemplate = await reorderProperties({
                    contentTemplateId,
                    fromIndex,
                    toIndex,
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete contentTemplate Property */
    api.delete(
        "/contentTemplates/:contentTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { contentTemplateId, fieldId } = req.params;
            try {
                const { user } = req;
                const contentTemplate = await deleteProperty({
                    contentTemplateId,
                    fieldId,
                    userId: user.id,
                });
                return res.status(200).send({
                    contentTemplate: contentTemplate && contentTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );
};
