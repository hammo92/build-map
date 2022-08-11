import { Content, ContentId } from "../../content/data/content.model";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { RelatedId, Relation, RelationIdentifier } from "./relation.model";

export async function createRelation({
    userId,
    contentId,
    fieldId,
    relatedContentId,
}: {
    userId: string;
    contentId: string;
    fieldId: string;
    relatedContentId: string;
}) {
    const date = new Date().toISOString();
    const newRelation = new Relation();

    newRelation.id = ulid();
    newRelation.createdTime = date;
    newRelation.createdBy = userId;
    newRelation.contentId = contentId;
    newRelation.fieldId = fieldId;
    newRelation.relatedContentId = relatedContentId;

    await newRelation.save();
}

export async function removeRelation({
    relatedContentId,
    fieldId,
}: {
    relatedContentId: string;
    fieldId: string;
}) {
    const relation = await indexBy(RelationIdentifier)
        .exact(`${fieldId}${relatedContentId}`)
        .get(Relation);
    if (!relation) throw new Error("No relation found");
    await relation.delete();
}

export async function deleteAllContentRelations(contentId: string) {
    //Todo Add history entry for change
    // get all relation instances where content is related
    const relations = await indexBy(RelatedId(contentId)).get(Relation);

    // get all relations on content
    const contentRelations = await indexBy(ContentId).get(Relation);

    if (!relations) throw new Error("No relations found for content");

    // get all content entries where content id is a relation entry
    const content = await Promise.all(
        relations.map(({ contentId }) => indexBy(ContentId).exact(contentId).get(Content))
    );

    if (!content) throw new Error("No content found with relation");

    // map over content and remove contentId from all relation field value array
    const contentPromises = content
        .map((contentEntry) => {
            if (!contentEntry) return undefined;
            contentEntry.fields.forEach((field) => {
                if (field.type === "relation") {
                    field.value = field.value?.filter((id) => id !== contentId);
                }
            });
            return contentEntry.save();
        })
        .filter((entry) => entry !== undefined);

    await Promise.all([
        ...contentPromises,
        relations.map((relation) => relation.delete()),
        contentRelations.map((relation) => relation.delete()),
    ]);
}
