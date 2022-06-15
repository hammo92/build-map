import { api } from "@serverless/cloud";
import * as data from "../data";

export const taskCollection = () => {
    //* create task collection */
    api.post("/taskCollections", async (req: any, res: any) => {
        try {
            const taskCollection = await data.createTaskCollection(req.body);
            return res.status(200).send({
                taskCollection: taskCollection.clean(),
            });
        } catch (error) {
            console.log(error);
            return res.status(403).send({
                message: error.message,
            });
        }
    });

    //* get taskCollection with associated data */
    api.get(
        "/taskCollections/:taskCollectionId",
        async (req: any, res: any) => {
            try {
                const taskCollection = await data.getTaskCollection({
                    collectionId: req.params.taskCollectionId,
                    withAssociatedData: true,
                });
                return res.status(200).send({
                    taskCollection: taskCollection.clean(),
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
