import { task } from "./task";
import { taskAssignment } from "./taskAssignment";
import { taskCollection } from "./taskCollection";
import { taskField } from "./taskField";

export const tasks = () => {
    task();
    taskAssignment();
    taskCollection();
    taskField();
};
