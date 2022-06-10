import { api, params } from "@serverless/cloud";
import snakecaseKeys from "snakecase-keys";
import {
    createContentType,
    createContentTypeField,
    deleteContentTypeById,
    deleteContentTypeField,
    getContentTypeById,
    getOrganisationContentTypes,
    reorderContentTypeFields,
    updateContentType,
    updateContentTypeField,
} from "../data";

export const contentTypes = () => {
    //* Create contentType */
    api.post("/contentTypes", async function (req: any, res: any) {
        const { name, organisationId, icon } = req.body;
        try {
            const { user } = req;
            const contentType = await createContentType({
                name,
                organisationId,
                userId: user.id,
                icon,
            });
            return res.status(200).send({
                newContentType: contentType && contentType.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get contentType */
    api.get(
        `/contentTypes/:contentTypeId`,
        async function (req: any, res: any) {
            const { contentTypeId } = req.params;

            try {
                const contentType = await getContentTypeById(contentTypeId);
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update contentType  */
    api.patch(
        `/contentTypes/:contentTypeId`,
        async function (req: any, res: any) {
            const { contentTypeId } = req.params;
            const { name, status, icon } = req.body;

            try {
                const contentType = await updateContentType({
                    contentTypeId,
                    name,
                    status,
                    icon,
                });
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete contentType */
    api.delete(
        `/contentTypes/:contentTypeId`,
        async function (req: any, res: any) {
            const { contentTypeId } = req.params;
            try {
                const contentType = await deleteContentTypeById(contentTypeId);
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Get organsation contentTypes */
    api.get(
        `/organisations/:organisationId/contentTypes`,
        async function (req: any, res: any) {
            try {
                const organisationId = req.params.organisationId;
                const contentTypes = await getOrganisationContentTypes(
                    organisationId
                );
                return res.status(200).send({
                    contentTypes: contentTypes.length
                        ? contentTypes.map((contentType) => contentType.clean())
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

    //* Create contentType Field */
    api.post(
        "/contentTypes/:contentTypeId/fields",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { contentTypeId } = req.params;
            try {
                const { user } = req;
                const contentType = await createContentTypeField({
                    contentTypeId,
                    fieldDetails,
                });
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Update contentType Field */
    api.patch(
        "/contentTypes/:contentTypeId/fields/:fieldId",
        async function (req: any, res: any) {
            const { fieldDetails } = req.body;
            const { contentTypeId, fieldId } = req.params;
            try {
                const { user } = req;
                const contentType = await updateContentTypeField({
                    contentTypeId,
                    fieldDetails,
                });
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Reorder contentType Field */
    api.post(
        "/contentTypes/:contentTypeId/reorderFields",
        async function (req: any, res: any) {
            const { fromIndex, toIndex } = req.body;
            const { contentTypeId } = req.params;
            try {
                const { user } = req;
                const contentType = await reorderContentTypeFields({
                    contentTypeId,
                    fromIndex,
                    toIndex,
                });
                return res.status(200).send({
                    contentType: contentType.clean(),
                });
            } catch (error: any) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* Delete contentType Field */
    api.delete(
        "/contentTypes/:contentTypeId/fields/:fieldId",
        async function (req: any, res: any) {
            const { contentTypeId, fieldId } = req.params;
            console.log("req.params", req.params);
            try {
                const { user } = req;
                const contentType = await deleteContentTypeField({
                    contentTypeId,
                    fieldId,
                });
                return res.status(200).send({
                    contentType: contentType && contentType.clean(),
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
