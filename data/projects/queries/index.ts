import { Project } from "@lib/project/data/projectModel";
import camelcaseKeys from "camelcase-keys";
import { apiClient } from "data/config";
import { CleanedSnake } from "type-helpers";

export async function createProject({
    name,
    organisationId,
}: {
    name: string;
    organisationId: string;
}) {
    const { data } = await apiClient.post<{ project: CleanedSnake<Project> }>(`projects`, {
        name,
        organisationId,
    });
    return camelcaseKeys(data, { deep: true });
}

export async function getMyProjects() {
    const { data } = await apiClient.get<{ projects: CleanedSnake<Project>[] }>(`me/projects`);
    return camelcaseKeys(data, { deep: true });
}

export async function deleteProject({ projectId }: { projectId: string }) {
    const { data } = await apiClient.delete<{ project: CleanedSnake<Project> }>(
        `/projects/${projectId}`
    );
    return camelcaseKeys(data, { deep: true });
}

export async function getOrgProjects({ organisationId }: { organisationId: string }) {
    const { data } = await apiClient.get(`/org/${organisationId}/projects`);
    return camelcaseKeys(data, { deep: true });
}
