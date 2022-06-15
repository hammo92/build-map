import { params } from "@serverless/cloud";
import axios from "axios";
import faker from "@faker-js/faker";
import { Task, TaskCollection } from "../data/task.model";
import { createTask, createTaskCollection, getTaskCollection } from "../data";
import { DEFAULTS } from "../data/defaults";
import { ModelRequired } from "../../../type-helpers";

// demo task collection generator
export const createDemoTaskCollection = async ({
    defaultSettings,
}: {
    defaultSettings: boolean;
}): Promise<TaskCollection> => {
    if (defaultSettings) {
        return await createTaskCollection();
    }
    const taskCollection = await createTaskCollection({
        categories: ["waiting", "started", "finished"],
        statusOptions: ["prompt", "delayed"],
        priorityOptions: ["medium", "critical"],
    });
    return taskCollection;
};

// demo task generator
export const createDemoTask = async (
    createTaskProps: ModelRequired<
        Task,
        "projectId" | "collectionId" | "creatorId"
    >
): Promise<Task> => {
    const { categories } = await getTaskCollection(
        createTaskProps.collectionId
    );
    return await createTask({
        title: faker.random.word(),
        category: categories[0],
        ...createTaskProps,
    });
};
