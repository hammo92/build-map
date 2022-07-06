import { api, params } from "@serverless/cloud";
import {
    createContent,
    getContentById,
    getProjectContentOfType,
    updateContentFields,
} from "../data";

export const content = () => {
    //* Create content */
    api.post("/content", async function (req: any, res: any) {
        const { contentTemplateId, projectId } = req.body;
        try {
            const { user } = req;
            const { newContent, contentTemplate } = await createContent({
                contentTemplateId,
                projectId,
                userId: user.id,
            });
            return res.status(200).send({
                newContent: newContent && newContent.clean(),
                contentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get content by id*/
    api.get(`/content/:contentId`, async function (req: any, res: any) {
        const { contentId } = req.params;

        try {
            const { content, contentTemplate } = await getContentById(contentId);
            return res.status(200).send({
                content: content && content.clean(),
                contentTemplate: contentTemplate && contentTemplate.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Update content fields*/
    api.patch(`/content/:contentId/fields`, async function (req: any, res: any) {
        const { contentId } = req.params;
        const { fields } = req.body;
        const { user } = req;
        try {
            const content = await updateContentFields({ contentId, fields, userId: user.id });
            return res.status(200).send({
                content: content && content.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* Get all content of type for project */
    api.get(
        `/projects/:projectId/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            try {
                const { projectId, contentTemplateId } = req.params;
                const { content, contentTemplate } = await getProjectContentOfType({
                    contentTemplateId,
                    projectId,
                });
                return res.status(200).send({
                    content: content.length ? content.map((content) => content.clean()) : [],
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
