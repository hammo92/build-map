import { api } from "@serverless/cloud";
import * as data from "../data";
import { TaskField } from "../data/models/taskField.model";

const taskFieldCompare = (first: TaskField, second: TaskField) =>
    first.sortIndex - second.sortIndex;

export const taskField = () => {
    //* create task field on collection and tasks */
    api.post(
        "/taskCollections/:taskCollectionId/fields",
        async (req: any, res: any) => {
            try {
                const taskField = await data.createTaskField({
                    ...req.body,
                    collectionId: req.params.taskCollectionId,
                });
                return res.status(200).send({
                    taskField: taskField.clean(),
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );
    //* get task fields for collection */
    api.get(
        "/taskCollections/:taskCollectionId/fields",
        async (req: any, res: any) => {
            try {
                const taskFields = await data.getTaskCollectionFields(
                    req.params.taskCollectionId
                );
                return res.status(200).send({
                    taskFields: taskFields
                        .sort(taskFieldCompare)
                        .map((taskField) => taskField.clean()),
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );
    //* update task field order */
    api.patch(
        "/taskCollections/:taskCollectionId/fields/sort",
        async (req: any, res: any) => {
            try {
                const taskFields = await data.changeFieldOrder({
                    collectionId: req.params.taskCollectionId,
                    currentIndex: req.body.currentIndex,
                    newIndex: req.body.newIndex,
                });
                return res.status(200).send({
                    taskFields: taskFields
                        .sort(taskFieldCompare)
                        .map((taskField) => taskField.clean()),
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );
    //* delete task field */
    api.delete(
        "/taskCollections/:taskCollectionId/fields/:fieldId",
        async (req: any, res: any) => {
            try {
                const removedField = await data.removeTaskField({
                    collectionId: req.params.taskCollectionId,
                    taskFieldId: req.params.fieldId,
                });
                return res.status(200).send({
                    removedField: removedField.clean(),
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );
};
