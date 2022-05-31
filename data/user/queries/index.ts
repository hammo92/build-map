import { apiClient } from "data/config";

export async function getMe() {
    const { data } = await apiClient.get(`/me`);
    return data;
}
