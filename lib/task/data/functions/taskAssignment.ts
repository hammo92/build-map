import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { ModelRequired } from "../../../../type-helpers";
import { AssignmentForTask, TaskAssignment, ActiveAssignment } from "../../data/models";

//* Get ActiveAssignment */
export async function getActiveAssignment(taskId: string) {
    const taskAssignments = await indexBy(ActiveAssignment(taskId))
        .exact("true")
        .get(TaskAssignment);
    return taskAssignments;
}

//* Get All TaskAssignments */
export async function getTaskAssigments(taskId: string) {
    const taskAssignments = await indexBy(AssignmentForTask(taskId)).get(TaskAssignment);
    return taskAssignments;
}

export async function assignTask(
    assignTaskProps: ModelRequired<TaskAssignment, "assigneeId" | "assignerId" | "taskId">
) {
    if (!assignTaskProps.assignerId || !assignTaskProps.assigneeId) {
        throw Error("assigner and assignee must be provided");
    }

    if (!assignTaskProps.taskId) {
        throw Error("task id must be provided");
    }

    const activeAssignments = await getActiveAssignment(assignTaskProps.taskId);
    await setAllTaskAssignmentsInactive(assignTaskProps.taskId);

    //if task has been previously assigned
    if (activeAssignments.length) {
        await Promise.all(
            activeAssignments.map(async (activeAssignment) => {
                activeAssignment.active = false;
                activeAssignment.reassignedDate = new Date().toISOString();
                await activeAssignment.save();
            })
        );
    }

    const newTaskAssignment = new TaskAssignment({
        id: ulid(),
        date: new Date().toISOString(),
        active: true,
        ...assignTaskProps,
    });
    await newTaskAssignment.save();
    return newTaskAssignment;
}

//* Set all task assignments to inactive */
export async function setAllTaskAssignmentsInactive(taskId: string) {
    const activeAssignments = await getActiveAssignment(taskId);
    //if task has been previously assigned
    if (activeAssignments.length) {
        await Promise.all(
            activeAssignments.map(async (activeAssignment) => {
                activeAssignment.active = false;
                activeAssignment.reassignedDate = new Date().toISOString();
                await activeAssignment.save();
            })
        );
    }
}

//* Delete task assignments */
export async function deleteTaskAssignments(taskId: string) {
    const taskAssignments = await getTaskAssigments(taskId);
    await Promise.all(taskAssignments.map((taskAssignment) => taskAssignment.delete()));
    return taskAssignments;
}
