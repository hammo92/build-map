//* content model and indexes //

import { FieldType } from "@components/contentType/constants";
import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";

interface ContentField {
    templateFieldId: string;
    fieldType: FieldType;
    value: any;
}

// To get all an contentType by it's ID *//
//namespace content:${contentId} */
export const ContentId = buildIndex({ namespace: `content` });

// To get all content of contentType for a project *//
//namespace project_${projectId}:contentType_${contentTypeId}:${date} */
export const ContentByTypeForProject = ({
    projectId,
    contentTypeId,
}: {
    projectId: string;
    contentTypeId: string;
}) =>
    buildIndex({
        namespace: `project_${projectId}:contentType_${contentTypeId}`,
        label: "label1",
        converter: timekey,
    });

//model: Content */
export class Content extends Model<Content> {
    id: string;
    contentTypeId: string;
    projectId: string;
    date: string;
    status: "draft" | "published";
    fields: ContentField[];
    keys() {
        return [
            indexBy(ContentId).exact(this.id),
            indexBy(
                ContentByTypeForProject({
                    projectId: this.projectId,
                    contentTypeId: this.contentTypeId,
                })
            ).exact(this.date),
        ];
    }
}
