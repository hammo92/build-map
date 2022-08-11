import { useGetMyProjects } from "@data/projects/hooks";
import { Stack, Text } from "@mantine/core";
import { FC } from "react";
import { ProjectListItem } from "./project-list-item";
import { useStyles } from "./styles";

export const ProjectList: FC = () => {
    const { data, isLoading } = useGetMyProjects();
    const { classes } = useStyles();
    if (data?.projects.length) {
        return (
            <>
                <Stack className={classes.container}>
                    {data.projects.map((project) => (
                        <ProjectListItem project={project} key={project.id} />
                    ))}
                </Stack>
            </>
        );
    }
    return <Text>No Projects Found</Text>;
};
