import { jest } from "@jest/globals";
import { api } from "@serverless/cloud";
import jwt from "jsonwebtoken";
import { deleteUserById } from "../../user/data";
import { User } from "../../user/data/userModel";
import { createDemoUser } from "../../user/tests/data";
import { deleteTaskCollection } from "../data";
import { DEFAULTS } from "../data/defaults";

let loggedInUser: User;
let otherUser: User;
beforeAll(async () => {
    //* create logged in user */
    loggedInUser = await createDemoUser();

    //* create other user */
    otherUser = await createDemoUser();

    //* mock auth for user*/
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
        id: loggedInUser.id,
        email: loggedInUser.email,
    }));
});

describe("create collection and add tasks", () => {
    let collectionId: string;
    let taskId: string;

    test("Should create a task collection", async () => {
        const { body } = await api.post(`/taskCollections`).invoke();
        collectionId = body.taskCollection.id;
        expect(body.taskCollection).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                categories: DEFAULTS.categories,
                date: expect.any(String),
            })
        );
    });

    test("Should get created collection, with empty tasks", async () => {
        const { body } = await api
            .get(`/taskCollections/${collectionId}`)
            .invoke();
        expect(body.taskCollection).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                categories: DEFAULTS.categories,
                date: expect.any(String),
                fields: expect.arrayContaining([
                    ...DEFAULTS.fields.map((field) =>
                        expect.objectContaining(field)
                    ),
                ]),
            })
        );
    });

    test("Should create a task", async () => {
        const { body } = await api
            .post(`/taskCollections/${collectionId}/tasks`)
            .invoke({
                collectionId,
                title: "new task",
                category: DEFAULTS.categories[0],
            });
        taskId = body.task.id;
        expect(body.task).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                collection_id: collectionId,
                title: "new task",
                category: DEFAULTS.categories[0],
            })
        );
    });

    test("Should get all fields for taskCollection", async () => {
        const {
            body: { taskFields },
        } = await api.get(`/taskCollections/${collectionId}/fields`).invoke();
        expect(taskFields).toEqual(
            expect.arrayContaining([
                ...DEFAULTS.fields.map((field) =>
                    expect.objectContaining(field)
                ),
            ])
        );
    });

    /*test("Should fail to assign task without assignee", async () => {
        const { body } = await api
            .post(`/tasks/${taskId}/assignments`)
            .invoke();
        expect(body.message).toEqual("assigner and assignee must be provided");
    });*/
    /*
    test("Should assign task", async () => {
        const { body } = await api.post(`/tasks/${taskId}/assignments`).invoke({
            assigneeId: otherUser.id,
        });
        expect(body.taskAssignment).toEqual(
            expect.objectContaining({
                assigner_id: loggedInUser.id,
                assignee_id: otherUser.id,
                date: expect.any(String),
                task_id: taskId,
            })
        );
    });

    test("Should get task by assigning user", async () => {
        const { body } = await api
            .get(`/user/${loggedInUser.id}/tasks/assigner`)
            .invoke();
        expect(body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),

                    collection_id: collectionId,
                    title: "new task",
                    category: DEFAULTS.categories[0],
                }),
            ])
        );
    });

    test("Should get task by assigned to user", async () => {
        const { body } = await api
            .get(`/user/${otherUser.id}/tasks/assignee`)
            .invoke();
        expect(body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    collection_id: collectionId,
                    title: "new task",
                    category: DEFAULTS.categories[0],
                }),
            ])
        );
    });

    test("Should assign task again", async () => {
        const { body } = await api.post(`/tasks/${taskId}/assignments`).invoke({
            assigneeId: loggedInUser.id,
        });
        expect(body.taskAssignment).toEqual(
            expect.objectContaining({
                assigner_id: loggedInUser.id,
                assignee_id: loggedInUser.id,
                date: expect.any(String),
                task_id: taskId,
            })
        );
    });

    
    test("Should get task reAssigned to user", async () => {
        const { body } = await api
            .get(`/user/${loggedInUser.id}/tasks/assignee`)
            .invoke();
        expect(body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    collection_id: collectionId,
                    title: "new task",
                    category: DEFAULTS.categories[0],
                }),
            ])
        );
    });

    test("Should get task assignments", async () => {
        const { body } = await api.get(`/tasks/${taskId}/assignments`).invoke();
        expect(body.taskAssignments).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    assigner_id: loggedInUser.id,
                    assignee_id: otherUser.id,
                    date: expect.any(String),
                    task_id: taskId,
                    active: false,
                }),
                expect.objectContaining({
                    assigner_id: loggedInUser.id,
                    assignee_id: loggedInUser.id,
                    date: expect.any(String),
                    task_id: taskId,
                    active: true,
                }),
            ])
        );
    });
    
    */
    test("Should get task by creating user", async () => {
        const { body } = await api
            .get(`/user/${loggedInUser.id}/tasks/created`)
            .invoke();
        expect(body.tasks).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    id: expect.any(String),
                    collection_id: collectionId,
                    title: "new task",
                    category: DEFAULTS.categories[0],
                }),
            ])
        );
    });

    test("Should get task by id", async () => {
        const { body } = await api.get(`/tasks/${taskId}`).invoke();
        expect(body.task).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                collection_id: collectionId,
                title: "new task",
                category: DEFAULTS.categories[0],
            })
        );
    });

    test("Should add field to task collection and tasks", async () => {
        const { body } = await api
            .post(`/taskCollections/${collectionId}/fields`)
            .invoke({
                title: "new field",
                type: "string",
            });

        expect(body.taskField).toEqual(
            expect.objectContaining({
                title: "new field",
                type: "string",
                id: expect.any(String),
                active: true,
                collection_id: collectionId,
                validate_on_change: false,
            })
        );
    });

    test("Should get task collection with created task", async () => {
        const { body } = await api
            .get(`/taskCollections/${collectionId}`)
            .invoke();
        expect(body.taskCollection).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                categories: DEFAULTS.categories,
                date: expect.any(String),
                fields: expect.arrayContaining([
                    ...DEFAULTS.fields.map(({ id }) =>
                        expect.objectContaining({ id })
                    ),
                ]),
                tasks: expect.arrayContaining([
                    expect.objectContaining({
                        id: expect.any(String),
                        collection_id: collectionId,
                        title: "new task",
                        category: DEFAULTS.categories[0],
                    }),
                ]),
            })
        );
    });

    test("Should delete a task", async () => {
        const { body } = await api.delete(`/tasks/${taskId}`).invoke();
        expect(body.task).toEqual(
            expect.objectContaining({
                id: expect.any(String),
                collection_id: collectionId,
                title: "new task",
                category: DEFAULTS.categories[0],
            })
        );
    });

    test("Should add 5 fields", async () => {
        const fieldDetails = [];
        for (let i = 4; i < 9; i++) {
            fieldDetails.push({
                collectionId,
                title: `new field ${i}`,
                sortIndex: i,
                type: `string`,
            });
        }
        const fields = await Promise.all(
            fieldDetails.map((field) =>
                api
                    .post(`/taskCollections/${collectionId}/fields`)
                    .invoke(field)
            )
        );
        expect(fields.map((field) => field.body)).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    taskField: expect.objectContaining({
                        title: "new field 4",
                        sort_index: 4,
                    }),
                }),
                expect.objectContaining({
                    taskField: expect.objectContaining({
                        title: "new field 5",
                        sort_index: 5,
                    }),
                }),
                expect.objectContaining({
                    taskField: expect.objectContaining({
                        title: "new field 6",
                        sort_index: 6,
                    }),
                }),
                expect.objectContaining({
                    taskField: expect.objectContaining({
                        title: "new field 7",
                        sort_index: 7,
                    }),
                }),
                expect.objectContaining({
                    taskField: expect.objectContaining({
                        title: "new field 8",
                        sort_index: 8,
                    }),
                }),
            ])
        );
    });

    test("Should move field at index 7 to index 5", async () => {
        const { body } = await api
            .patch(`/taskCollections/${collectionId}/fields/sort`)
            .invoke({
                currentIndex: 7,
                newIndex: 5,
            });
        expect(body.taskFields).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "new field 4",
                    sort_index: 4,
                }),
                expect.objectContaining({
                    title: "new field 7",
                    sort_index: 5,
                }),
                expect.objectContaining({
                    title: "new field 5",
                    sort_index: 6,
                }),
                expect.objectContaining({
                    title: "new field 6",
                    sort_index: 7,
                }),
                expect.objectContaining({
                    title: "new field 8",
                    sort_index: 8,
                }),
            ])
        );
    });

    test("Should remove field by id, update indexes on other fields", async () => {
        const {
            body: { taskFields },
        } = await api.get(`/taskCollections/${collectionId}/fields`).invoke();
        const idToRemove = taskFields.find(
            (taskField) => taskField.title === "new field 7"
        ).id;
        await api
            .delete(`/taskCollections/${collectionId}/fields/${idToRemove}`)
            .invoke();
        const { body } = await api
            .get(`/taskCollections/${collectionId}/fields`)
            .invoke();
        expect(body.taskFields).toEqual(
            expect.arrayContaining([
                expect.objectContaining({
                    title: "new field 4",
                    sort_index: 4,
                }),
                expect.objectContaining({
                    title: "new field 5",
                    sort_index: 5,
                }),
                expect.objectContaining({
                    title: "new field 6",
                    sort_index: 6,
                }),
                expect.objectContaining({
                    title: "new field 8",
                    sort_index: 7,
                }),
            ])
        );
    });

    afterAll(async () => {
        await Promise.all([deleteTaskCollection(collectionId)]);
    });
});

afterAll(async () => {
    await Promise.all([
        deleteUserById(loggedInUser.id),
        deleteUserById(otherUser.id),
    ]);
});
