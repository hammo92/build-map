import { getAssetById } from "../../../lib/asset/data";
import { indexBy } from "serverless-cloud-data-utils";
import { ModelRequired } from "type-helpers";
import { v4 as uuidv4 } from "uuid";
import { getContentTemplateById } from "../../contentTemplate/data";
import { errorIfUndefined, errorRequiredPropsUndefined } from "../../utils";
import { Content, ContentByTypeForProject, ContentId } from "./content.model";
import { ContentField } from "./types";

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
    newContent.createdBy = userId;
    newContent.lastEditedTime = new Date().toISOString();
    newContent.lastEditedBy = userId;
    newContent.date = new Date().toISOString();
    newContent.fields = contentTemplate.fields.map((field) => {
        return {
            ...field,
            ...(field.defaultValue && { value: field?.defaultValue }),
            id: uuidv4(),
            templateFieldId: field.id,
        };
    });
    await newContent.save();
    return { newContent, contentTemplate };
}

async function fetchLinkedContentPromises(field: ContentField) {
    if (field.type === "image" && field?.value?.length) {
        const assets = await Promise.all(field.value.map((assetId) => getAssetById(assetId)));
        return { ...field, assets };
    }
    return field;
}

//* Get content by id */
export async function getContentById(contentId: string) {
    errorIfUndefined({ contentId });
    const content = await indexBy(ContentId).exact(contentId).get(Content);
    if (!content) {
        throw new Error("Content not found");
    }
    /*const fieldsWithContent = await Promise.all(
        content.fields.map(async (field) => await fetchLinkedContentPromises(field))
    );
    content.fields = fieldsWithContent;*/
    const contentTemplate = await getContentTemplateById(content.contentTemplateId);
    return { content, contentTemplate };
}

//* Get all content for contentTemplate for project */
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

//* Update content fields */
export async function updateContentFields(props: {
    contentId: string;
    fields: ContentField[];
    userId: string;
}) {
    const { contentId, fields, userId } = props;
    errorIfUndefined({ contentId, userId, fields });

    const { content } = await getContentById(contentId);
    if (!content) throw new Error("No content found");

    content.fields = fields.length
        ? fields.map((field) => ({
              ...field,
              lastEditedBy: userId,
              lastEditedAt: new Date().toISOString(),
          }))
        : fields;
    content.lastEditedTime = new Date().toISOString();
    content.lastEditedBy = userId;
    await content.save();
    return content;
}
