import { Project } from "@lib/project/data/projectModel";
import { apiClient } from "data/config";
import { CleanedSnake, StripModel } from "type-helpers";

export async function createProject({
    name,
    organisationId,
}: {
    name: string;
    organisationId: string;
}) {
    const { data } = await apiClient.post<{ project: CleanedSnake<Project> }>(
        `projects`,
        {
            name,
            organisationId,
        }
    );
    return data;
}

export async function getMyProjects() {
    const { data } = await apiClient.get<{ projects: CleanedSnake<Project>[] }>(
        `me/projects`
    );
    return data;
}

export async function deleteProject({ projectId }: { projectId: string }) {
    const { data } = await apiClient.delete<{ project: CleanedSnake<Project> }>(
        `/projects/${projectId}`
    );
    return data;
}

export async function getOrgProjects({
    organisationId,
}: {
    organisationId: string;
}) {
    const { data } = await apiClient.get(`/org/${organisationId}/projects`);
    return data;
}
