import { faker } from "@faker-js/faker";
import { createOrganisation } from "../data";

// demo organisation generator
export const createDemoOrganisation = async (userId: string) => {
    const organisation = await createOrganisation({
        name: faker.company.companyName(),
        userId,
    });
    return organisation;
};
