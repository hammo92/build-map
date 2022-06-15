import { api } from "@serverless/cloud";
import * as data from "../data";

export const taskAssignment = () => {
    //* create task assignment  */
    api.post("/tasks/:taskId/assignments", async (req: any, res: any) => {
        try {
            const taskAssignment = await data.assignTask({
                assignerId: req.user.id,
                taskId: req.params.taskId,
                ...req.body,
            });
            return res.status(200).send({
                taskAssignment: taskAssignment.clean(),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get taskAssignments for task*/
    api.get("/tasks/:taskId/assignments", async (req: any, res: any) => {
        try {
            const taskAssignments = await data.getTaskAssigments(
                req.params.taskId
            );
            return res.status(200).send({
                taskAssignments: taskAssignments.map((taskAssignment) =>
                    taskAssignment.clean()
                ),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get taskAssignments for task*/
    api.delete("/tasks/:taskId/assignments", async (req: any, res: any) => {
        try {
            const taskAssignments = await data.getTaskAssigments(
                req.params.taskId
            );
            return res.status(200).send({
                taskAssignments: taskAssignments.map((taskAssignment) =>
                    taskAssignment.clean()
                ),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });
};
