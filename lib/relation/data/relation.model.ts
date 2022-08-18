import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

// To get relation by it's ID *//
//namespace relations:${fieldId}${relatedContentId} */
export const RelationIdentifier = buildIndex({ namespace: `relations` });

// Get all relations related to content id
//namespace relations:relatedContent:${relatedContentId}:${relationId} */
export const RelatedId = (relatedContentId: string) =>
    buildIndex({ namespace: `relations:relatedContent_${relatedContentId}`, label: "label1" });

// Get all relations on content
//namespace relations:relatedContent:${relatedContentId}:${relationId} */
export const ContentId = (contentId: string) =>
    buildIndex({ namespace: `relations:content_${contentId}`, label: "label2" });

//model: Content */
export class Relation extends Model<Relation> {
    id: string;
    createdTime: string;
    createdBy: string;
    type = "relation";

    /** Id of content with relation */
    contentId: string;

    /* Id of relation field on content */
    fieldId: string;

    /** Id of related content*/
    relatedContentId: string;

    keys() {
        return [
            indexBy(RelationIdentifier).exact(`${this.fieldId}${this.relatedContentId}`),
            indexBy(RelatedId(this.relatedContentId)).exact(this.id),
            indexBy(ContentId(this.contentId)).exact(this.id),
        ];
    }
}
