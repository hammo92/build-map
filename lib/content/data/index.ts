import { errorIfUndefined } from "../../utils";
import { Content, ContentByTypeForProject, ContentId } from "./content.model";
import { v4 as uuidv4 } from "uuid";
import { indexBy } from "serverless-cloud-data-utils";
import { data } from "@serverless/cloud";
import { getContentTemplateById } from "../../contentTemplate/data";

//* Create content */
export async function createContent({
    contentTemplateId,
    projectId,
    userId,
}: {
    contentTemplateId: string;
    projectId: string;
    userId: string;
}) {
    errorIfUndefined({ contentTemplateId, projectId, userId });
    const contentTemplate = await getContentTemplateById(contentTemplateId);
    if (!contentTemplate) {
        throw new Error("Content template not found");
    }
    // create contentTemplate //
    const newContent = new Content();
    newContent.contentTemplateId = contentTemplateId;
    newContent.projectId = projectId;
    newContent.status = "draft";
    newContent.id = uuidv4();
    newContent.date = new Date().toISOString();
    newContent.fields = [];

    // add contentTemplate fields //
    /*newContentTemplate.fields = fields.map((field) => {
        return { ...field, id: uuidv4(), active: true };
    });*/

    await newContent.save();
    return { newContent, contentTemplate };
}

//* Get content by id */
export async function getContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const content = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) {
        throw new Error("Content not found");
    }
    const contentTemplate = await getContentTemplateById(
        content.contentTemplateId
    );
    return { content, contentTemplate };
}

//* Get all content of contentTemplate for project */
export async function getProjectContentOfType({
    contentTemplateId,
    projectId,
}: {
    contentTemplateId: string;
    projectId: string;
}) {
    errorIfUndefined({ contentTemplateId, projectId });
    const contentTemplate = await getContentTemplateById(contentTemplateId);
    if (!contentTemplate) {
        throw new Error("Content template not found");
    }
    const contentOfType = await indexBy(
        ContentByTypeForProject({ contentTemplateId, projectId })
    ).get(Content);
    return { content: contentOfType, contentTemplate };
}
