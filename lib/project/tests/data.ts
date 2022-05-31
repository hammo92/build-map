import { faker } from "@faker-js/faker";
import axios from "axios";
import { Address } from "../../../definitions";
import { createProject } from "../data";
export const generateAddress = async ({
    withCoordinates,
}: {
    withCoordinates: boolean;
}) => {
    let coordinates;
    const { data } = await axios.get(
        "https://api.postcodes.io/random/postcodes"
    );
    const {
        result: { postcode, latitude, longitude },
    } = data;

    if (withCoordinates) {
        coordinates = {
            latitude,
            longitude,
        };
    }

    return {
        line1: faker.address.streetAddress(),
        line2: faker.address.secondaryAddress(),
        town: faker.address.cityName(),
        postcode,
        ...coordinates,
    };
};

// demo project generator
export const createDemoProject = async ({
    userId,
    organisationId,
    withAddress,
    withCoordinates,
}: {
    userId: string;
    organisationId: string;
    withAddress?: boolean;
    withCoordinates?: boolean;
}) => {
    let address: Address;
    if (withAddress) {
        address = await generateAddress({ withCoordinates: true });
    }
    const newProject = await createProject({
        name: faker.company.companyName(),
        organisationId,
        jobNumber: faker.random.alphaNumeric(),
        userId,
        address,
    });
    return newProject;
};
