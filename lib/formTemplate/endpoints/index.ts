import { api, params } from "@serverless/cloud";
import snakecaseKeys from "snakecase-keys";
import {
    createFormTemplate,
    createFormTemplateField,
    deleteFormTemplateById,
    deleteFormTemplateField,
    getFormTemplateById,
    getOrganisationFormTemplates,
    reorderFormTemplateFields,
    updateFormTemplate,
    updateFormTemplateField,
} from "../data";

export const formTemplates = () => {
    //* Create formTemplate */
    api.post("/formTemplates", async function (req: any, res: any) {
        const { name, organisationId } = req.body;
        try {
            const { user } = req;
            const formTemplate = await createFormTemplate({
                name,
                organisationId,
                userId: user.id,
            });
            return res.status(200).send({
                newFormTemplate: formTemplate && formTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get formTemplate */
    api.get(
        `/formTemplates/:formTemplateId`,
        async function (req: any, res: any) {
            const { formTemplateId } = req.params;

            try {
                const formTemplate = await getFormTemplateById(formTemplateId);
                return res.status(200).send({
                    formTemplate: formTemplate && formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update formTemplate  */
    api.patch(
        `/formTemplates/:formTemplateId`,
        async function (req: any, res: any) {
            const { formTemplateId } = req.params;
            const { name, status } = req.body;

            try {
                const formTemplate = await updateFormTemplate({
                    formTemplateId,
                    name,
                    status,
                });
                return res.status(200).send({
                    formTemplate: formTemplate && formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete formTemplate */
    api.delete(
        `/formTemplates/:formTemplateId`,
        async function (req: any, res: any) {
            const { formTemplateId } = req.params;
            try {
                const formTemplate = await deleteFormTemplateById(
                    formTemplateId
                );
                return res.status(200).send({
                    formTemplate: formTemplate && formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Get organsation formTemplates */
    api.get(
        `/organisations/:organisationId/formTemplates`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const formTemplates = await getOrganisationFormTemplates(
                    organisationId
                );
                return res.status(200).send({
                    formTemplates:
                        formTemplates.length &&
                        formTemplates.map((formTemplate) =>
                            formTemplate.clean()
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

    //* Create formTemplate Field */
    api.post(
        "/formTemplates/:formTemplateId/fields",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { formTemplateId } = req.params;
            try {
                const { user } = req;
                const formTemplate = await createFormTemplateField({
                    formTemplateId,
                    fieldDetails,
                });
                return res.status(200).send({
                    // not a model so can't clean, need to send snakecase over network
                    formTemplate: formTemplate && formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update formTemplate Field */
    api.patch(
        "/formTemplates/:formTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { formTemplateId, fieldId } = req.params;
            try {
                const { user } = req;
                const formTemplate = await updateFormTemplateField({
                    formTemplateId,
                    fieldDetails,
                });
                return res.status(200).send({
                    formTemplate: formTemplate && formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Reorder formTemplate Field */
    api.post(
        "/formTemplates/:formTemplateId/reorderFields",
        async function (req: any, res: any) {
            const { fromIndex, toIndex } = req.body;
            const { formTemplateId } = req.params;
            try {
                const { user } = req;
                const formTemplate = await reorderFormTemplateFields({
                    formTemplateId,
                    fromIndex,
                    toIndex,
                });
                return res.status(200).send({
                    formTemplate: formTemplate.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete formTemplate Field */
    api.delete(
        "/formTemplates/:formTemplateId/fields/:fieldId",
        async function (req: any, res: any) {
            const { formTemplateId, fieldId } = req.params;
            console.log("req.params", req.params);
            try {
                const { user } = req;
                const formTemplate = await deleteFormTemplateField({
                    formTemplateId,
                    fieldId,
                });
                return res.status(200).send({
                    formTemplate: formTemplate && formTemplate.clean(),
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
