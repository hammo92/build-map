import { api } from "@serverless/cloud";
import * as data from "../data";
import { Task } from "../data";

export const task = () => {
    //* create task  */
    api.post(
        "/taskCollections/:taskCollectionId/tasks",
        async (req: any, res: any) => {
            try {
                const task = await data.createTask({
                    creatorId: req.user.id,
                    collectionId: req.params.taskCollectionId,
                    ...req.body,
                });
                return res.status(200).send({
                    task: task.clean(), //cleanTask(task),
                });
            } catch (error) {
                console.log(error);
                return res.status(403).send({
                    message: error.message,
                });
            }
        }
    );

    //* get task */
    api.get("/tasks/:taskId", async (req: any, res: any) => {
        try {
            const task = await data.getTask(req.params.taskId);

            return res.status(200).send({
                task: task.clean(),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* delete task */
    api.delete("/tasks/:taskId", async (req: any, res: any) => {
        try {
            const task = await data.getTask(req.params.taskId);
            await task.delete();
            return res.status(200).send({
                task: task.clean(),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get tasks created by user */
    api.get("/user/:userId/tasks/created", async (req: any, res: any) => {
        try {
            const tasks = await data.getTaskCreatedByUser(req.params.userId);
            return res.status(200).send({
                tasks: tasks.map((task) => task.clean()),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get tasks assigned by user */
    api.get("/user/:userId/tasks/assigner", async (req: any, res: any) => {
        try {
            const tasks = await data.getTaskAssignedByUser(req.params.userId);
            return res.status(200).send({
                tasks: tasks.map((task) => task.clean()),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get tasks assigned to user */
    api.get("/user/:userId/tasks/assignee", async (req: any, res: any) => {
        try {
            const tasks = await data.getTaskAssignedToUser(req.params.userId);
            return res.status(200).send({
                tasks: tasks.map((task) => task.clean()),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });
};
