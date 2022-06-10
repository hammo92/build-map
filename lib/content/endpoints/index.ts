import { api, params } from "@serverless/cloud";
import {
    createContent,
    getContentById,
    getProjectContentOfType,
} from "../data";

export const content = () => {
    //* Create content */
    api.post("/content", async function (req: any, res: any) {
        const { contentTypeId, projectId } = req.body;
        try {
            const { user } = req;
            const { newContent, contentType } = await createContent({
                contentTypeId,
                projectId,
                userId: user.id,
            });
            return res.status(200).send({
                newContent: newContent && newContent.clean(),
                contentType: contentType && contentType.clean(),
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
            const { content, contentType } = await getContentById(contentId);
            return res.status(200).send({
                content: content && content.clean(),
                contentType: contentType && contentType.clean(),
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
        `/projects/:projectId/contentTypes/:contentTypeId`,
        async function (req: any, res: any) {
            try {
                const { projectId, contentTypeId } = req.params;
                const { content, contentType } = await getProjectContentOfType({
                    contentTypeId,
                    projectId,
                });
                return res.status(200).send({
                    content: content.length
                        ? content.map((content) => content.clean())
                        : [],
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
