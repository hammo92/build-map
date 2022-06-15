import { indexBy } from "serverless-cloud-data-utils";
import { objArrayToMapIndexedByValue } from "utils/arrayModify";
import { v4 as uuidv4 } from "uuid";
import { getTaskCollectionFields } from "..";
import { ModelRequired } from "../../../../type-helpers";
import {
    CollectionTasks,
    Task,
    TaskAssignee,
    TaskAssigner,
    TaskAssignment,
    TaskCollection,
    TaskId,
    UserTasksCreated,
} from "../../data/models";
import { deleteTaskAssignments, getTaskCollection } from "../functions";

//* Add associated data to task */
const AddTaskRelatedData = async (tasks: Task[]) => {
    if (!tasks.length) return [];

    let fields = await getTaskCollectionFields(tasks[0].collectionId);
    fields = fields.map((field) => field.clean());

    // index field info by field id for easy access
    const fieldsMap = objArrayToMapIndexedByValue(fields, "id");
    //

    // add field data for fields on task
    tasks.forEach((task) => {
        // if task has fields with stored values
        if (task.fields?.length) {
            const taskFieldsMap = objArrayToMapIndexedByValue(
                task.fields,
                "id"
            );
            task.fields = fields.map(({ id }) => {
                const value = taskFieldsMap.get(id);
                return { id, value: value ?? null, details: fieldsMap.get(id) };
            });
        } else {
            task.fields = fields.map(({ id }) => ({
                id,
                value: null,
                details: fieldsMap.get(id),
            }));
        }
    });
    return tasks;
};

//* Create Task */
export async function createTask(
    createTaskProps: ModelRequired<
        Task,
        "collectionId" | "creatorId" | "title" | "category"
    >
) {
    const fields = await getTaskCollectionFields(createTaskProps.collectionId);
    const newTask = new Task({
        id: uuidv4(),
        complete: false,
        createdDate: new Date().toISOString(),
        startDate: new Date().toISOString(),
        fields: fields.map(({ id }) => ({ id, value: null })),
        ...createTaskProps,
    });
    await newTask.save();
    return newTask;
}

//* Get Task by id */
export async function getTask(taskId: string, withAssociatedData?: boolean) {
    const task = await indexBy(TaskId).exact(taskId).get(Task);
    if (!task) {
        throw new Error("No task found");
    }
    if (!withAssociatedData) {
        return task;
    }
    const taskWithData = task && (await AddTaskRelatedData([task]));
    return taskWithData[0];
}

//* Get Tasks created by user */
export async function getTaskCreatedByUser(userId: string) {
    const tasks = await indexBy(UserTasksCreated(userId)).get(Task);
    const tasksWithData = await AddTaskRelatedData(tasks);
    //TODO add sort
    return tasksWithData;
}

//* Get all TaskCollection Tasks */
export async function getAllTaskCollectionTasks(taskCollectionId: string) {
    const tasks = await indexBy(CollectionTasks(taskCollectionId)).get(Task);
    const tasksWithData = await AddTaskRelatedData(tasks);
    return tasksWithData;
}

//* Get tasks for Category */
export async function getCategoryTasks({
    collectionId,
    taskCategoryName,
}: {
    collectionId: string;
    taskCategoryName: string;
}): Promise<[Task[], TaskCollection]> {
    const taskCollection = await getTaskCollection({ collectionId });

    if (!taskCollection) {
        throw new Error("No task collection found");
    }
    // check category exists on task
    if (!taskCollection.categories?.includes(taskCategoryName)) {
        throw Error("Category not valid");
    }

    const tasks = await getAllTaskCollectionTasks(collectionId);
    // find any tasks whose category matches
    const tasksMatchingCategory = tasks.filter(
        (task) => taskCategoryName === task.category
    );

    return [tasksMatchingCategory, taskCollection];
}

//* Get Tasks assigned by user */
export async function getTaskAssignedByUser(userId: string) {
    // get all assignment entries
    const assignments = await indexBy(TaskAssigner(userId)).get(TaskAssignment);
    // get all tasks from assignments
    const tasks = await Promise.all(
        assignments.map(async (assignment) => {
            const task = await indexBy(TaskId)
                .exact(assignment.taskId)
                .get(Task);
            return task;
        })
    );
    //TODO add sort
    return tasks;
}

//* Get Tasks assigned to user */
export async function getTaskAssignedToUser(userId: string) {
    // get all assignment entries
    const assignments = await indexBy(TaskAssignee(userId)).get(TaskAssignment);
    // get all tasks from assignments
    const tasks = await Promise.all(
        assignments.map(async (assignment) => {
            const task = await indexBy(TaskId)
                .exact(assignment.taskId)
                .get(Task);
            return task;
        })
    );
    //TODO add sort
    return tasks;
}

//* Update Task */
export async function updateTask(taskId: string, updateTaskProps: Task) {
    const task = await getTask(taskId, false);
    if (!task) {
        throw new Error("No task found");
    }
    // iterate over provided props and assign to task
    Object(updateTaskProps).keys.map((key: string) => {
        task[key] = updateTaskProps[key];
    });
    await task.save();
    return task;
}

//* Delete task */
export async function deleteTask(taskId: string) {
    const task = await getTask(taskId, false);
    // delete task and assignments
    await Promise.all([task.delete(), deleteTaskAssignments(taskId)]);
    return task;
}
