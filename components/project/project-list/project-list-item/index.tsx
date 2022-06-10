import { useDeleteProject } from "@data/projects/hooks";
import { faArrowRight, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Project } from "@lib/project/data/projectModel";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
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
            onClick={() => router.push(`/projects/${project.id}`)}
        >
            <Group position="apart">
                <Group direction="column" spacing="xs">
                    <Text transform="capitalize">{project.name}</Text>
                </Group>
                <Group>
                    <ActionIcon>
                        <FontAwesomeIcon icon={faArrowRight} />
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
