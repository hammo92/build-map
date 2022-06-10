import { errorIfUndefined } from "../../utils";
import { Content, ContentByTypeForProject, ContentId } from "./content.model";
import { v4 as uuidv4 } from "uuid";
import { indexBy } from "serverless-cloud-data-utils";
import { data } from "@serverless/cloud";
import { getContentTypeById } from "../../contentType/data";

//* Create content */
export async function createContent({
    contentTypeId,
    projectId,
    userId,
}: {
    contentTypeId: string;
    projectId: string;
    userId: string;
}) {
    errorIfUndefined({ contentTypeId, projectId, userId });
    const contentType = await getContentTypeById(contentTypeId);
    if (!contentType) {
        throw new Error("Content type not found");
    }
    // create contentType //
    const newContent = new Content();
    newContent.contentTypeId = contentTypeId;
    newContent.projectId = projectId;
    newContent.status = "draft";
    newContent.id = uuidv4();
    newContent.date = new Date().toISOString();
    newContent.fields = [];

    // add contentType fields //
    /*newContentType.fields = fields.map((field) => {
        return { ...field, id: uuidv4(), active: true };
    });*/

    await newContent.save();
    return { newContent, contentType };
}

//* Get content by id */
export async function getContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const content = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) {
        throw new Error("Content not found");
    }
    const contentType = await getContentTypeById(content.contentTypeId);
    return { content, contentType };
}

//* Get all content of contentType for project */
export async function getProjectContentOfType({
    contentTypeId,
    projectId,
}: {
    contentTypeId: string;
    projectId: string;
}) {
    errorIfUndefined({ contentTypeId, projectId });
    const contentType = await getContentTypeById(contentTypeId);
    if (!contentType) {
        throw new Error("Content type not found");
    }
    const contentOfType = await indexBy(
        ContentByTypeForProject({ contentTypeId, projectId })
    ).get(Content);
    return { content: contentOfType, contentType };
}
