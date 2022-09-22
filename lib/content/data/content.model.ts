//* content model and indexes //

import { PropertyGroup } from "../../../lib/contentTemplate/data/contentTemplate.model";
import { BaseModelId, ModelWithHistory } from "../../../lib/models";
import { buildIndex, indexBy } from "serverless-cloud-data-utils";
import { ContentField } from "./types";

export type FieldGroup = PropertyGroup;

export type ContentStatus = "draft" | "published" | "archived";

// To get content by it's ID *//
//namespace content:${contentId} */
export const ContentId = buildIndex({ namespace: `content`, label: "label1" });

// To get a content by templateId, filter by project  *//
//namespace content:template_${templateId}:${projectId} */
export const ContentTemplate = ({ templateId }: { templateId: string }) =>
    buildIndex({
        namespace: `content:template_${templateId}`,
        label: "label2",
    });

// To get a content by outdated status  *//
//namespace content:outdated_${outdated}:template_${templateId}:${contentId} */
export const ContentOutdated = ({
    outdated,
    templateId,
}: {
    outdated: boolean;
    templateId: string;
}) =>
    buildIndex({
        namespace: `content:outdated_${outdated}:templateId_${templateId}`,
        label: "label2",
    });

//model: Content */
export class Content extends ModelWithHistory<"Content", Content> {
    contentTemplateId: string;
    projectId: string;
    publishTime: string;
    status: "draft" | "published" | "archived";
    fields: ContentField[];
    fieldGroups: FieldGroup[];
    contentTemplateVersion: string;
    title: string;

    modelKeys() {
        return [
            indexBy(ContentId).exact(this.id),
            indexBy(ContentTemplate({ templateId: this.contentTemplateId })).exact(this.projectId),
        ];
    }
}
