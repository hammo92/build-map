import { faker } from "@faker-js/faker";
import { createUser } from "../data";

export const createDemoUser = async () => {
    const user = await createUser({
        email: faker.internet.email(),
        name: faker.name.findName(),
        password: faker.internet.password(),
    });
    return user;
};
