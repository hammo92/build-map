import { useGetMyProjects } from "@data/projects/hooks";
import { Button, Group, Modal, Text, Title } from "@mantine/core";
import React, { FC, useState } from "react";
import { ProjectListItem } from "./project-list-item";
import { useStyles } from "./styles";

export const ProjectList: FC = () => {
    const { data, isLoading } = useGetMyProjects();
    console.log("data", data);
    const { classes } = useStyles();
    if (data?.projects.length) {
        return (
            <>
                <Group direction="column" grow className={classes.container}>
                    {data.projects.map((project) => (
                        <ProjectListItem project={project} key={project.id} />
                    ))}
                </Group>
            </>
        );
    }
    return <Text>No Projects Found</Text>;
};
