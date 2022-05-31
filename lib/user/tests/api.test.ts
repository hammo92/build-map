// api.test.ts
import { jest } from "@jest/globals";
import { api } from "@serverless/cloud";
import jwt from "jsonwebtoken";
import { deleteUserById } from "../data";
import { User } from "../data/user.model";
import { createDemoUser } from "./data";

let loggedInUser: User;

beforeAll(async () => {
    //* create logged in user */
    loggedInUser = await createDemoUser();

    //* mock auth for user*/
    jest.spyOn(jwt, "verify").mockImplementation(() => ({
        id: loggedInUser.id,
        email: loggedInUser.email,
    }));
});

describe("register, login, and remove user", () => {
    let userId: string;
    test("Should register a user", async () => {
        const { body } = await api.post(`/register`).invoke({
            name: "Joanna Smith",
            email: "joannaSmith@email.com",
            password: "password",
        });
        userId = body.user.id;
        expect(body).toEqual({
            user: {
                id: expect.any(String),
                name: "Joanna Smith",
                email: "joannaSmith@email.com",
            },
            token: expect.any(String),
        });
    });

    test("Should login a user", async () => {
        const { body } = await api.post(`/login`).invoke({
            email: "joannaSmith@email.com",
            password: "password",
        });
        expect(body).toEqual({
            user: {
                id: expect.any(String),
                name: "Joanna Smith",
                email: "joannaSmith@email.com",
            },
            token: expect.any(String),
        });
    });

    afterAll(async () => {
        await deleteUserById(userId);
    });
});

test("Should get logged in user", async () => {
    const { body } = await api.get(`/me`).invoke();
    expect(body.user).toEqual(loggedInUser.clean(["salt", "hashedPassword"]));
});

test("Should get user by email", async () => {
    const { body } = await api.get(`/users/${loggedInUser.email}`).invoke();
    expect(body.user).toEqual(loggedInUser.clean(["salt", "hashedPassword"]));
});

test("Should get user by id", async () => {
    const { body } = await api.get(`/users/${loggedInUser.id}`).invoke();
    expect(body.user).toEqual(loggedInUser.clean(["salt", "hashedPassword"]));
});

test("Should update loggedInUser name", async () => {
    await api.patch(`/me`).invoke({
        name: "John Smith",
    });
    const { body } = await api.get(`/users/${loggedInUser.id}`).invoke();
    expect(body.user).toEqual({
        ...loggedInUser.clean(["salt", "hashedPassword"]),
        name: "John Smith",
    });
});

test("Should update loggedInUser password", async () => {
    const { body } = await api.patch(`/me`).invoke({
        password: "newPassword",
    });
    expect(body.user).toEqual({
        ...loggedInUser.clean(["salt", "hashedPassword"]),
        name: "John Smith",
    });
});

test("Should login with a new password", async () => {
    const { body } = await api.post(`/login`).invoke({
        email: loggedInUser.email,
        password: "newPassword",
    });
    expect(body).toEqual({
        user: {
            id: expect.any(String),
            name: "John Smith",
            email: loggedInUser.email,
        },
        token: expect.any(String),
    });
});

test("Should update loggedInUser name and password", async () => {
    const { body } = await api.patch(`/me`).invoke({
        name: "Jack Johnson",
        password: "newPasswordAgain",
    });
    expect(body.user).toEqual({
        ...loggedInUser.clean(["salt", "hashedPassword"]),
        name: "Jack Johnson",
    });
});

test("Should login with another new password", async () => {
    const { body } = await api.post(`/login`).invoke({
        email: loggedInUser.email,
        password: "newPasswordAgain",
    });
    expect(body).toEqual({
        user: {
            id: expect.any(String),
            name: "Jack Johnson",
            email: loggedInUser.email,
        },
        token: expect.any(String),
    });
});

test("Should delete loggedInUser", async () => {
    const { body } = await api.delete(`/me`).invoke();
    expect(body.user).toEqual({
        ...loggedInUser.clean(["salt", "hashedPassword"]),
        name: "Jack Johnson",
    });
});

test("test description", async () => {});

afterAll(async () => {
    await Promise.all([loggedInUser.delete()]);
});
