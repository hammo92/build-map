import { ModelRequired } from "../../../type-helpers";
import { TaskField } from "./models/taskField.model";

export const DEFAULTS: {
    categories: string[];
    fields: ModelRequired<TaskField, "title" | "type">[];
} = {
    categories: ["to do", "doing", "done"],
    fields: [
        {
            title: "assigned to",
            type: "assignment",
            active: true,
            removable: false,
        },
        {
            title: "due date",
            type: "dueDate",
            active: true,
            removable: false,
        },
        {
            title: "status",
            type: "select",
            options: [
                { value: "ahead", color: "green" },
                { value: "on time", color: "blue" },
                { value: "behind", color: "red" },
            ],
            active: true,
            removable: true,
        },
        {
            title: "priority",
            type: "select",
            options: [
                { value: "low", color: "green" },
                { value: "medium", color: "orange" },
                { value: "high", color: "red" },
            ],
            active: true,
            removable: true,
        },
    ],
};
