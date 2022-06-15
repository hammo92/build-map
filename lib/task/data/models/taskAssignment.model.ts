import {
    buildIndex,
    indexBy,
    Model,
    timekey,
} from "serverless-cloud-data-utils";

//* TaskAssignment model and indexes */
//namespace task_${taskId}:assignment:${date} */
export const AssignmentForTask = (taskId: string) =>
    buildIndex({
        namespace: `task_${taskId}:assignment`,
    });

//namespace user_${userId}:tasks:assignee:${date} */
export const TaskAssignee = (assigneeId: string) =>
    buildIndex({
        namespace: `user_${assigneeId}:tasks:assignee`,
        converter: timekey,
        label: "label1",
    });

//namespace user_${userId}:tasks:assigner:${date} */
export const TaskAssigner = (assignerId: string) =>
    buildIndex({
        namespace: `user_${assignerId}:tasks:assigner`,
        converter: timekey,
        label: "label2",
    });

//namespace task_${taskId}:assignment:${active} */
export const ActiveAssignment = (taskId: string) =>
    buildIndex({
        namespace: `task_${taskId}:assignment:active`,
        label: "label3",
    });

//model: taskAssignment*/
export class TaskAssignment extends Model<TaskAssignment> {
    id: string;
    assignerId: string;
    date: string;
    reassignedDate?: string;
    taskId: string;
    active: boolean;
    assigneeId: string;
    assigneeCategory: string; // "do today", "do next week" etc
    keys() {
        return [
            indexBy(AssignmentForTask(this.taskId)).exact(this.date),
            indexBy(TaskAssignee(this.assigneeId)).exact(this.date),
            indexBy(TaskAssigner(this.assignerId)).exact(this.date),
            indexBy(ActiveAssignment(this.taskId)).exact(this.active),
        ];
    }
}
