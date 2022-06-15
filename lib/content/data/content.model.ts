//* content model and indexes //

import {
    FieldType,
    FIELD_TYPES,
} from "@components/contentTemplate/contentTemplate-field/field-options/fieldsDefinitions";
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

// To get all an contentTemplate by it's ID *//
//namespace content:${contentId} */
export const ContentId = buildIndex({ namespace: `content` });

// To get all content of contentTemplate for a project *//
//namespace project_${projectId}:contentTemplate_${contentTemplateId}:${date} */
export const ContentByTypeForProject = ({
    projectId,
    contentTemplateId,
}: {
    projectId: string;
    contentTemplateId: string;
}) =>
    buildIndex({
        namespace: `project_${projectId}:contentTemplate_${contentTemplateId}`,
        label: "label1",
        converter: timekey,
    });

//model: Content */
export class Content extends Model<Content> {
    id: string;
    contentTemplateId: string;
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
                    contentTemplateId: this.contentTemplateId,
                })
            ).exact(this.date),
        ];
    }
}
