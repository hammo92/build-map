import { errorIfUndefined } from "../../../lib/utils";
import { indexBy } from "serverless-cloud-data-utils";
import { Field, FieldCollection, FieldId } from "./field.model";

export async function getField(fieldId: string) {
    errorIfUndefined({ fieldId });
    const [field] = await indexBy(FieldId).exact(fieldId).get(Field);
    return field;
}

export async function deleteFieldCollection(collectionId: string) {
    /** collection is a shared parent of fields */
    errorIfUndefined({ collectionId });
    const fields = await indexBy(FieldCollection(collectionId)).get(Field);
    await Promise.all(fields.map((field) => field.delete()));
}
