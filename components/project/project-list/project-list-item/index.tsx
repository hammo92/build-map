import { useDeleteProject } from "@data/projects/hooks";
import { faArrowRight, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Project } from "@lib/project/data/projectModel";
import { ActionIcon, Card, Group, Stack, Text } from "@mantine/core";
import { useRouter } from "next/router";
import React, { FC } from "react";
import { CleanedCamel } from "type-helpers";

interface ProjectListItemProps {
    project: CleanedCamel<Project>;
}

export const ProjectListItem: FC<ProjectListItemProps> = ({ project }) => {
    const router = useRouter();
    const { mutateAsync } = useDeleteProject();
    return (
        <Card
            shadow="sm"
            sx={(theme) => ({
                cursor: "pointer",
                width: "100%",
                background: theme.colors.dark[5],
            })}
        >
            <Group position="apart">
                <Stack spacing="xs">
                    <Text transform="capitalize">{project.name}</Text>
                </Stack>
                <Group>
                    <ActionIcon>
                        <FontAwesomeIcon
                            icon={faArrowRight}
                            onClick={() => router.push(`/projects/${project.id}`)}
                        />
                    </ActionIcon>
                    <ActionIcon
                        onClick={() =>
                            mutateAsync({
                                projectId: project.id,
                            })
                        }
                        variant="filled"
                        color="red"
                    >
                        <FontAwesomeIcon icon={faTrash} />
                    </ActionIcon>
                </Group>
            </Group>
        </Card>
    );
};
