import { api } from '@serverless/cloud'
import {
    createContent,
    deleteContentById,
    getContentById,
    getContentOfTemplate,
    repeatGroup,
    updateContentStatus,
    updateContentValues,
} from '../data'

export const content = () => {
    //* Create content */
    api.post('/content', async function (req: any, res: any) {
        const { contentTemplateId, projectId } = req.body
        try {
            const { user } = req
            const { newContent, contentTemplate } = await createContent({
                contentTemplateId,
                projectId,
                userId: user.id,
            })
            return res.status(200).send({
                newContent: newContent && newContent.clean(),
                contentTemplate: contentTemplate && contentTemplate.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Get content by id*/
    api.get(`/content/:contentId`, async function (req: any, res: any) {
        const { contentId } = req.params

        try {
            const { content, contentTemplate, contentFields } =
                await getContentById(contentId)
            return res.status(200).send({
                content: content && content.clean(),
                contentTemplate: contentTemplate && contentTemplate.clean(),
                contentFields:
                    contentFields.length &&
                    contentFields.map((field) => field.clean()),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Delete content by id*/
    api.delete(`/content/:contentId`, async function (req: any, res: any) {
        const { contentId } = req.params
        console.log('contentId', contentId)
        try {
            const content = await deleteContentById(contentId)
            return res.status(200).send({
                content: content && content.clean(),
            })
        } catch (error: any) {
            console.log(error)
            return res.status(403).send({
                message: error.message,
            })
        }
    })

    //* Update content status*/
    api.patch(
        `/content/:contentId/status`,
        async function (req: any, res: any) {
            const { contentId } = req.params
            const { status } = req.body
            const { user } = req
            try {
                const content = await updateContentStatus({
                    contentId,
                    status,
                    userId: user.id,
                })
                return res.status(200).send({
                    content: content && content.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update content values*/
    api.patch(
        `/content/:contentId/values`,
        async function (req: any, res: any) {
            const { contentId } = req.params
            const { values } = req.body
            const { user } = req
            try {
                const content = await updateContentValues({
                    contentId,
                    values,
                    userId: user.id,
                })
                return res.status(200).send({
                    content: content && content.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update content fields*/
    /*api.patch(`/content/:contentId/fields`, async function (req: any, res: any) {
        const { contentId } = req.params;
        const { updates, deletions } = req.body;
        const { user } = req;
        try {
            const content = await updateContentFields({
                contentId,
                updates,
                deletions,
                userId: user.id,
            });
            return res.status(200).send({
                content: content && content.clean(),
            });
        } catch (error: any) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });*/

    //* Add repeatable group entry*/
    api.post(
        `/content/:contentId/groups/:groupId`,
        async function (req: any, res: any) {
            const { contentId, groupId } = req.params
            const { updates, deletions } = req.body
            const { user } = req
            try {
                const content = await repeatGroup({
                    contentId,
                    groupId,
                    userId: user.id,
                })
                return res.status(200).send({
                    content: content && content.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )

    //* Update content to latest Template*/
    /*api.patch(
        `/content/:contentId/patchFromTemplate`,
        async function (req: any, res: any) {
            const { contentId } = req.params
            const { user } = req
            try {
                const content = await UpdateContentFromTemplate({
                    contentId,
                    userId: user.id,
                })
                return res.status(200).send({
                    content: content && content.clean(),
                })
            } catch (error: any) {
                console.log(error)
                return res.status(403).send({
                    message: error.message,
                })
            }
        }
    )*/

    //* Get all content for contentTemplate for project */
    api.get(
        `/projects/:projectId/contentTemplates/:contentTemplateId`,
        async function (req: any, res: any) {
            try {
                const { projectId, contentTemplateId } = req.params
                const { content, contentTemplate } = await getContentOfTemplate(
                    {
                        contentTemplateId,
                        projectId,
                    }
                )
                return res.status(200).send({
                    content: content.length
                        ? content.map((content) => content.clean())
                        : [],
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

    /*events.on(
        "ContentTemplate.updated",
        async ({
            body,
        }: {
            body: {
                historyEntry: HistoryEntry;
                templateId: string;
            };
        }) => {
            //setContentOutdated(body);
            // console.time();
            // contentAndTemplateDifference({ templateId: body.templateId });
            // console.timeEnd();
            console.log("ContentTemplate updated");
            handleContentTemplateChange(body);
        }
    );*/
}
