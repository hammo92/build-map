import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";
import { Task } from "./task.model";
import { TaskField } from "./taskField.model";

//* TaskCollection model and indexes */

//namespace taskCollection:${taskCollectionId} */
export const TaskCollectionId = buildIndex({ namespace: `taskCollection` });

// TaskCollection Model */
export class TaskCollection extends Model<TaskCollection> {
    id: string;
    projectId: string;
    date?: string;
    categories?: string[];

    // not stored, set on return
    fields: TaskField[];
    tasks?: Task[];

    keys() {
        return [indexBy(TaskCollectionId).exact(this.id)];
    }
}
