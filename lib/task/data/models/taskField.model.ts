import { buildIndex, indexBy, Model } from "serverless-cloud-data-utils";

//* TaskField model and indexes */

//namespace taskField:${taskFieldId} */
export const TaskFieldId = buildIndex({ namespace: `taskField` });

//namespace taskCollection_${taskCollectionId}:taskFields:${taskFieldId} */
export const TaskCollectionFields = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:taskStatus`,
        label: "label1",
    });

export const fieldTypesToValidate: FieldTypes[] = ["select", "multiSelect"];

export type FieldTypes =
    | "select"
    | "multiSelect"
    | "number"
    | "string"
    | "assignment"
    | "dueDate";

// TaskField Model */
export class TaskField extends Model<TaskField> {
    id: string;
    title: string;
    type: FieldTypes;
    active: boolean;
    validateOnChange: boolean;
    description: string;
    options: any[];
    collectionId: string;
    removable: boolean;
    sortIndex: number;
    keys() {
        return [
            indexBy(TaskFieldId).exact(this.id),
            indexBy(TaskCollectionFields(this.collectionId)).exact(this.id),
        ]; 
    }
}
