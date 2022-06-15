import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";
import { TaskAssignment } from "./taskAssignment.model";
import { TaskField } from "./taskField.model";

//* Task model and indexes */
//namespace tasks:${taskId} */
export const TaskId = buildIndex({ namespace: `tasks` });

//namespace taskCollection_${taskCollectionId}:tasks:${date} */
export const CollectionTasks = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:tasks`,
        label: "label1",
        converter: timekey,
    });

//namespace user_${userId}:createdTasks:${date} */
export const UserTasksCreated = (userId: string) =>
    buildIndex({
        namespace: `user_${userId}:createdTasks`,
        label: "label2",
        converter: timekey,
    });

//namespace taskCollection_${taskCollectionId}:taskCategory:${category} */
export const TaskCategory = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:taskCategory`,
        label: "label3",
    });

//namespace taskCollection_${taskCollectionId}:taskCategory:${category} */
export const TaskPriority = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:taskPriority`,
        label: "label4",
    });

//namespace taskCollection_${taskCollectionId}:taskCategory:${category} */
export const TaskStatus = (taskCollectionId: string) =>
    buildIndex({
        namespace: `taskCollection_${taskCollectionId}:taskStatus`,
        label: "label5",
    });

//model Task*/
export class Task extends Model<Task> {
    id: string;
    collectionId: string;
    creatorId: string;
    title: string;
    createdDate: string;
    startDate: string;
    modifiedDate: string;
    deadline?: string;
    category: string; //"To do", "doing" etc
    fields: {
        id: string;
        value: any | any[] | null;
        fieldDetails?: TaskField; // not stored, returned on query
        updatedBy?: string;
    }[];
    subtaskCollectionId?: string;
    description?: string;
    complete?: boolean;
    media?: string[]; 
    //set on return for assignment queries
    assignmentId?: string;
    keys() {
        return [
            indexBy(TaskId).exact(this.id),
            indexBy(CollectionTasks(this.collectionId)).exact(this.createdDate),
            indexBy(UserTasksCreated(this.creatorId)).exact(this.createdDate),
            indexBy(TaskCategory(this.collectionId)).exact(this.category),
            //indexBy(TaskStatus(this.collectionId)).exact(this.status),
            //indexBy(TaskPriority(this.collectionId)).exact(this.priority),
        ];
    }
}
