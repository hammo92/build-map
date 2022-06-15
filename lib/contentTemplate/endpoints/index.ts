import { api, params } from "@serverless/cloud";
import snakecaseKeys from "snakecase-keys";
import {
    createContentTemplate,
    createContentTemplateField,
    deleteContentTemplateById,
    deleteContentTemplateField,
    getContentTemplateById,
    getOrganisationContentTemplates,
    reorderContentTemplateFields,
    updateContentTemplate,
    updateContentTemplateField,
} from "../data";

export const contentTemplates = () => {
    //* Create contentTemplate */
    api.post("/contentTemplates", async function (req: any, res: any) {
        const { name, organisationId, icon, type } = req.body;
        try {
            const { user } = req;
            const contentTemplate = await createContentTemplate({
                name,
                organisationId,
                userId: user.id,
                icon,
                type,
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
    api.get(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params;

            try {
                const contentTemplate = await getContentTemplateById(
                    contentTemplateId
                );
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

    //* Update contentTemplate  */
    api.patch(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params;
            const { name, status, icon } = req.body;

            try {
                const contentTemplate = await updateContentTemplate({
                    contentTemplateId,
                    name,
                    status,
                    icon,
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

    //* Delete contentTemplate */
    api.delete(
        `/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            const { contentTemplateId } = req.params;
            try {
                const contentTemplate = await deleteContentTemplateById(
                    contentTemplateId
                );
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

    //* Get organsation contentTemplates */
    api.get(
        `/organisations/:organisationId/contentTemplates`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const contentTemplates = await getOrganisationContentTemplates(
                    organisationId
                );
                return res.status(200).send({
                    contentTemplates: contentTemplates.length
                        ? contentTemplates.map((contentTemplate) =>
                              contentTemplate.clean()
                          )
                        : [],
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Create contentTemplate Field */
    api.post(
        "/contentTemplates/:contentTemplateId/fields",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { contentTemplateId } = req.params;
            try {
                const { user } = req;
                const contentTemplate = await createContentTemplateField({
                    contentTemplateId,
                    fieldDetails,
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

    //* Update contentTemplate Field */
    api.patch(
        "/contentTemplates/:contentTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { contentTemplateId, fieldId } = req.params;
            try {
                const { user } = req;
                const contentTemplate = await updateContentTemplateField({
                    contentTemplateId,
                    fieldDetails,
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

    //* Reorder contentTemplate Field */
    api.post(
        "/contentTemplates/:contentTemplateId/reorderFields",
        async function (req: any, res: any) {
            const { fromIndex, toIndex } = req.body;
            const { contentTemplateId } = req.params;
            try {
                const { user } = req;
                const contentTemplate = await reorderContentTemplateFields({
                    contentTemplateId,
                    fromIndex,
                    toIndex,
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

    //* Delete contentTemplate Field */
    api.delete(
        "/contentTemplates/:contentTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { contentTemplateId, fieldId } = req.params;
            console.log("req.params", req.params);
            try {
                const { user } = req;
                const contentTemplate = await deleteContentTemplateField({
                    contentTemplateId,
                    fieldId,
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
