import { apiClient } from "@data/config";

export const login = async ({
    email,
    password,
}: {
    email: string;
    password: string;
}) => {
    const { data } = await apiClient.post(`/login`, {
        email,
        password,
    });
    return data;
};

export async function register({
    email,
    password,
    name,
}: {
    email: string;
    password: string;
    name: string;
}) {
    const { data } = await apiClient.post(`/users`, {
        email,
        password,
        name,
    });
    return data;
}
