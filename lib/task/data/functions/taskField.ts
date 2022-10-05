import { errorIfUndefined } from "@lib/utils";
import { indexBy } from "serverless-cloud-data-utils";
import { ulid } from "ulid";
import { getAllTaskCollectionTasks, getTaskCollection } from "..";
import { ModelPick, ModelRequired } from "../../../../type-helpers";
import {
    FieldType,
    TaskCollectionFields,
    TaskField,
    TaskFieldId,
    fieldTypesToValidate,
} from "../models/taskField.model";

//* Create taskField */
export async function createTaskField(
    createTaskFieldProps: ModelRequired<TaskField, "title" | "type" | "collectionId">
) {
    const { title, type, collectionId } = createTaskFieldProps;
    errorIfUndefined({ title, type, collectionId });

    const taskCollectionFields = await getTaskCollectionFields(createTaskFieldProps.collectionId);

    // find highest sortIndex
    const highestIndexField = taskCollectionFields.reduce((acc, val) =>
        val.sortIndex > acc.sortIndex ? val : acc
    );

    const taskField = new TaskField({
        id: ulid(),
        active: true,
        validateOnChange: fieldTypesToValidate.includes(createTaskFieldProps.type),
        sortIndex: highestIndexField.sortIndex + 1,
        ...createTaskFieldProps,
    });

    await taskField.save();

    return taskField;
}

//* Get taskField by Id
export async function getTaskFieldById(fieldId: string) {
    const taskField = await indexBy(TaskFieldId).exact(fieldId).get(TaskField);
    return taskField;
}

//* Get taskCollectionFields
export async function getTaskCollectionFields(collectionId: string) {
    const taskFields = await indexBy(TaskCollectionFields(collectionId)).get(TaskField);
    return taskFields;
}

//* Update TaskCollection Fields
export async function updateTaskField({
    field,
}: {
    field: ModelPick<TaskField, "id" | "active" | "description" | "options", "id">;
}) {
    if (!field.id) {
        throw new Error("Property not found");
    }
    const storedField = await getTaskFieldById(field.id);
    if (!storedField) throw new Error("No field found");

    // if task field value needs to be checked (eg select field option)
    if (storedField.validateOnChange && field.options !== storedField.options) {
        const tasks = await getAllTaskCollectionTasks(storedField.collectionId);

        if (tasks?.length) {
            await Promise.all(
                tasks.map((task) => {
                    // check that field with matching id has value that is valid option
                    // if not set value to null and save
                    const taskField = task.fields.find(({ id }) => id == field.id);
                    if (!field.options?.includes(taskField?.value)) {
                        if (taskField?.value) {
                            taskField.value = null;
                        }
                        return task.save();
                    }
                })
            );
        }
    }
    // remove non-writable fields
    let { id, ...rest } = field;

    // update field with new data
    Object.keys(rest).map((key) => (storedField[key] = rest[key]));

    // save changes
    await storedField.save();

    // // if index is provided move field in fields array
    // if (index) {
    //     const taskCollection = await getTaskCollection(
    //         storedField.collectionId,
    //         false
    //     );

    //     // find field location in taskCollection fields array
    //     const fieldIndex = taskCollection.fields.findIndex(
    //         ({ id }) => storedField.id === id
    //     );

    //     // move field to new index
    //     const newOrderArray = moveInsideArray(
    //         taskCollection.fields,
    //         fieldIndex,
    //         index
    //     );

    //     // update taskCollection fields
    //     taskCollection.fields = newOrderArray;
    // }

    return storedField;
}

//* Change Property order
export async function changeFieldOrder({
    collectionId,
    currentIndex,
    newIndex,
}: {
    collectionId: string;
    currentIndex: number;
    newIndex: number;
}) {
    const taskFields = await indexBy(TaskCollectionFields(collectionId)).get(TaskField);

    // Check field exists with index
    if (!taskFields.filter(({ sortIndex }) => sortIndex === currentIndex).length) {
        throw new Error("No task at this index");
    }

    // const newFieldOrder = moveInsideArray(taskFields, currentIndex, newIndex);

    // await Promise.all(newFieldOrder.map((field) => field.save()));

    await Promise.all(
        taskFields.map((field) => {
            if (field.sortIndex === currentIndex) {
                field.sortIndex = newIndex;
                return field.save();
            }
            if (
                newIndex > currentIndex &&
                field.sortIndex > currentIndex &&
                field.sortIndex <= newIndex
            ) {
                field.sortIndex--;
                return field.save();
            }
            if (
                newIndex < currentIndex &&
                field.sortIndex < currentIndex &&
                field.sortIndex >= newIndex
            ) {
                field.sortIndex++;
                return field.save();
            }
        })
    );

    return taskFields;
}

//* Remove TaskCollection Property
export async function removeTaskField({
    collectionId,
    taskFieldId,
}: {
    collectionId: string;
    taskFieldId: string;
}) {
    const taskFields = await indexBy(TaskCollectionFields(collectionId)).get(TaskField);
    const tasks = await getAllTaskCollectionTasks(collectionId);
    const fieldToRemove = taskFields.find((field) => field.id === taskFieldId);
    // update indexes on fields with higher sortIndex
    const fieldUpdatePromises = taskFields.map((taskField) => {
        if (taskField.sortIndex > fieldToRemove.sortIndex) {
            taskField.sortIndex--;
            return taskField.save();
        }
    });

    // remove field from tasks
    const taskUpdatePromises = tasks.map((task) => {
        const matchingFieldIndex = task.fields.findIndex((field) => field.id === fieldToRemove.id);
        if (matchingFieldIndex) {
            task.fields.splice(matchingFieldIndex, 1);
            return task.save();
        }
    });

    // remove field in all tasks
    await Promise.all([fieldToRemove.delete(), ...fieldUpdatePromises, ...taskUpdatePromises]);
    return fieldToRemove;
}
