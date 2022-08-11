import { errorIfUndefined } from "@lib/utils";
import dayjs from "dayjs";
import isBetween from "dayjs/plugin/isBetween";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { getTaskCollectionFields } from "..";
import { DEFAULTS } from "../defaults";
import { deleteTask, getAllTaskCollectionTasks, getCategoryTasks } from "../functions";
import { TaskCollection, TaskCollectionId } from "../models/";
import { fieldTypesToValidate, TaskField } from "../models/taskField.model";
dayjs.extend(isBetween);

//* Add associated data to taskCollection */
const AddTaskRelatedData = async (taskCollection: TaskCollection) => {
    const fields = await getTaskCollectionFields(taskCollection.id);
    const tasks = await getAllTaskCollectionTasks(taskCollection.id);
    // will be returned by api so needs to be cleaned
    taskCollection.fields = fields.map((field) => field.clean());
    taskCollection.tasks = tasks.map((task) => task.clean());
    return taskCollection;
};

//* Create task collection */
export async function createTaskCollection(createTaskCollectionProps?: Partial<TaskCollection>) {
    const taskCollection = new TaskCollection({
        id: ulid(),
        categories: DEFAULTS.categories,
        date: new Date().toISOString(),
        ...createTaskCollectionProps,
    });

    // create default fields
    const fields = DEFAULTS.fields.map((field, i) => {
        const taskField = new TaskField({
            id: ulid(),
            active: true,
            sortIndex: i,
            collectionId: taskCollection.id,
            validateOnChange: fieldTypesToValidate.includes(field.type),
            ...field,
        });
        return taskField;
    });

    // save taskCollection and fields
    await Promise.all([taskCollection.save(), ...fields.map((field) => field.save())]);
    return taskCollection;
}

//* Get TaskCollection */
export async function getTaskCollection({
    collectionId,
    withAssociatedData,
}: {
    collectionId: string;
    withAssociatedData?: boolean;
}) {
    errorIfUndefined({ collectionId });
    const taskCollection = await indexBy(TaskCollectionId).exact(collectionId).get(TaskCollection);
    if (!taskCollection) {
        throw new Error("No task collection found");
    }
    if (!withAssociatedData) {
        return taskCollection;
    }
    const taskCollectionWithData = await AddTaskRelatedData(taskCollection);
    return taskCollectionWithData;
}

//* Remove TaskCollection Category */
export async function updateTaskCategory({
    collectionId,
    taskCategoryName,
    keepTasks,
}: {
    collectionId: string;
    taskCategoryName: string;
    keepTasks: boolean;
}) {
    errorIfUndefined({ collectionId, taskCategoryName });
    const [categoryTasks, taskCollection] = await getCategoryTasks({
        collectionId,
        taskCategoryName,
    });
    if (!taskCollection) {
        throw new Error("No task collection found");
    }

    // remove category from taskCollection
    taskCollection.categories?.splice(taskCollection.categories.indexOf(taskCategoryName), 1);

    // move or delete tasks
    if (keepTasks) {
        // create new category for orphaned tasks
        taskCollection.categories?.unshift("");
        // assign task collection to new category
        await Promise.all(
            categoryTasks.map(async (task) => {
                task.category = "";
                await task.save();
            })
        );
    } else {
        await Promise.all(categoryTasks.map(async (task) => await deleteTask(task.id)));
    }

    await taskCollection.save();
    return taskCollection;
}

//* Rename TaskCollection Category
export async function renameTaskCategory({
    collectionId,
    taskCategoryName,
    newName,
}: {
    collectionId: string;
    taskCategoryName: string;
    newName: string;
}) {
    errorIfUndefined({ collectionId, taskCategoryName, newName });
    const [categoryTasks, taskCollection] = await getCategoryTasks({
        collectionId,
        taskCategoryName,
    });

    if (!taskCollection) {
        throw new Error("No task collection found");
    }

    if (taskCollection.categories) {
        // update category name in task collection
        taskCollection.categories[taskCollection.categories.indexOf(taskCategoryName)] = newName;
    }

    // update category name in category tasks
    await Promise.all(
        categoryTasks.map(async (task) => {
            task.category = newName;
            await task.save();
        })
    );

    await taskCollection.save();
    return taskCollection;
}

//* Update Task Collection */
export async function updateTaskCollection(
    collectionId: string,
    updateTaskCollectionProps: TaskCollection
) {
    errorIfUndefined({ collectionId, updateTaskCollectionProps });
    const taskCollection = await getTaskCollection({ collectionId });
    if (!taskCollection) {
        throw new Error("No task collection found");
    }
    // iterate over provided props and assign to taskcollection
    Object(updateTaskCollectionProps).keys.map((key: keyof TaskCollection) => {
        taskCollection[key] = updateTaskCollectionProps[key];
    });
    await taskCollection.save();
    return taskCollection;
}

//* Delete task collection */
export async function deleteTaskCollection(collectionId: string) {
    const taskCollection = await getTaskCollection({ collectionId });
    const tasks = await getAllTaskCollectionTasks(collectionId);
    const fields = await getTaskCollectionFields(collectionId);
    // delete taskCollection and tasks
    await Promise.all([
        taskCollection.delete(),
        ...tasks.map((task) => deleteTask(task.id)),
        ...fields.map((field) => field.delete()),
    ]);
    return taskCollection;
}
