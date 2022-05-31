import { faArrowRight, faTrash } from "@fortawesome/pro-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { ActionIcon, Card, Group, Text } from "@mantine/core";
import React, { FC } from "react";
import { useRouter } from "next/router";
import { Project } from "@lib/project/data/projectModel";
import { CleanedSnake } from "type-helpers";
import { useDeleteProject } from "@data/projects/hooks";

interface ProjectListItemProps {
    project: CleanedSnake<Project>;
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

            //onClick={() => router.push(`/project/${project.id}`)}
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
